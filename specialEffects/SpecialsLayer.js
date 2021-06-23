import { FXCanvasAnimation } from "../module/canvasanimation.js"
import { easeFunctions } from "../module/ease.js";

export class SpecialsLayer extends PlaceablesLayer {
  constructor() {
    super();
    this.videos = [];
    this._dragging = false;
    // Listen to the socket
    game.socket.on("module.fxmaster", (data) => {
      this.playVideo(data);
    });
  }

  static documentName = "Tile";

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "specials",
      zIndex: 245
    });
  }

  get hud() {
    return null;
  }

  get tiles() {
    return [];
  }

  playVideo(data) {
    return new Promise((resolve) => {
      // Set default values
      data = foundry.utils.mergeObject({
        anchor: { x: 0.5, y: 0.5 },
        rotation: 0,
        scale: { x: 1.0, y: 1.0 },
        position: { x: 0, y: 0 },
        playbackRate: 1.0,
        ease: "Linear"
      }, data);

      // Create video
      const video = document.createElement("video");
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.src = data.file;
      video.playbackRate = data.playbackRate;
      this.videos.push(video);

      // Create PIXI sprite
      let vidSprite;
      video.oncanplay = () => {
        const texture = PIXI.Texture.from(video);
        vidSprite = new PIXI.Sprite(texture);
        this.addChild(vidSprite);

        // Set values
        vidSprite.anchor.set(data.anchor.x, data.anchor.y);
        vidSprite.rotation = Math.normalizeRadians(data.rotation - Math.toRadians(data.angle));
        vidSprite.scale.set(data.scale.x, data.scale.y);
        vidSprite.position.set(data.position.x, data.position.y);

        vidSprite.width = data.width | vidSprite.width;

        if ((!data.speed || data.speed === 0) && !data.distance) {
          return;
        }
        if (data.distance && (data.speed == "auto" || !data.speed)) {
          data.speed = data.distance / video.duration;
        }
        // Compute final position
        const delta = video.duration * data.speed;
        const deltaX = delta * Math.cos(data.rotation)
        const deltaY = delta * Math.sin(data.rotation)

        // Move the sprite
        const attributes = [{
          parent: vidSprite, attribute: 'x', to: data.position.x + deltaX
        }, {
          parent: vidSprite, attribute: 'y', to: data.position.y + deltaY
        }
        ];
        let animationDuration = video.duration * 1000;
        if (foundry.utils.hasProperty(data, "animationDelay")) {
          animationDuration -= Math.max(0, 1000 * (data.animationDelay.end + data.animationDelay.start));
        }
        const animate = function () {
          FXCanvasAnimation.animateSmooth(attributes, {
            name: `fxmaster.video.${randomID()}.move`,
            context: this,
            duration: animationDuration,
            ease: easeFunctions[data.ease]
          })
        }
        if (foundry.utils.hasProperty(data, "animationDelay.start")) {
          setTimeout(animate, data.animationDelay.start * 1000.0);
        } else {
          animate();
        }
      };

      video.onerror = () => {
        this.removeChild(vidSprite);
        resolve();
        vidSprite?.destroy();
      }
      video.onended = () => {
        this.removeChild(vidSprite);
        vidSprite?.destroy();
        resolve();
      }
    })
  }

  static _createMacro(effectData) {
    return `
      const data = {
        file: "${effectData.file}",
        position: {
          x: canvas.scene.dimensions.width / 2,
          y: canvas.scene.dimensions.height / 2
        },
        anchor : {
          x: ${effectData.anchor.x},
          y: ${effectData.anchor.y}
        },
        angle: ${effectData.angle},
        speed: ${effectData.speed},
        scale: {
          x: ${effectData.scale.x},
          y: ${effectData.scale.y}
        }
      };
      const tokens = canvas.tokens.controlled;
      // No tokens are selected, play in a random position
      if (tokens.length === 0) {
        canvas.specials.playVideo(data);
        game.socket.emit("module.fxmaster", data);
        return;
      }
      const targets = game.user.targets;
      if (targets.size !== 0) {
        tokens.forEach(t1 => {
          targets.forEach(t2 => {
            canvas.specials.drawFacing(data, t1, t2);
          })
        })
        return;
      }
      // Play effect on each token
      tokens.forEach(t => {
        data.position = {
          x: t.position.x + t.w / 2,
          y: t.position.y + t.h / 2
        };
        canvas.specials.playVideo(data);
        game.socket.emit("module.fxmaster", data);
      })
      
    `;
  }

  drawSpecialToward(effect, tok1, tok2) {
    const origin = {
      x: tok1.position.x + tok1.w / 2,
      y: tok1.position.y + tok1.h / 2
    }
    const effectData = foundry.utils.mergeObject(effect, {
      position: {
        x: origin.x,
        y: origin.y
      }
    });
    const target = {
      x: tok2.position.x + tok2.w / 2,
      y: tok2.position.y + tok2.h / 2
    }
    // Compute angle
    const ray = new Ray(origin, target);
    effectData.distance = ray.distance;
    effectData.rotation = ray.angle;
    // Play to other clients
    game.socket.emit('module.fxmaster', effectData);
    // Play effect locally
    return this.playVideo(effectData);
  }

  drawFacing(effect, tok1, tok2) {
    const origin = {
      x: tok1.position.x + tok1.w / 2,
      y: tok1.position.y + tok1.h / 2
    }
    const effectData = foundry.utils.mergeObject(effect, {
      position: {
        x: origin.x,
        y: origin.y
      }
    });
    const target = {
      x: tok2.position.x + tok2.w / 2,
      y: tok2.position.y + tok2.h / 2
    }
    // Compute angle
    const ray = new Ray(origin, target);
    effectData.rotation = ray.angle;
    // Play to other clients
    game.socket.emit('module.fxmaster', effectData);
    // Play effect locally
    return this.playVideo(effectData);
  }

  _drawSpecial(event) {
    const windows = Object.values(ui.windows);
    const effectConfig = windows.find((w) => w.id == "specials-config");
    if (!effectConfig) return;
    const active = effectConfig.element.find(".active");
    if (active.length == 0) return;

    const id = active[0].dataset.effectId;
    const folder = active[0].closest(".folder").dataset.folderId;
    const effect = CONFIG.fxmaster.userSpecials[folder].effects[id];
    let data = foundry.utils.mergeObject(effect, {
      position: {
        x: event.data.origin.x,
        y: event.data.origin.y,
      },
      rotation: event.data.rotation
    });
    event.stopPropagation();
    game.socket.emit("module.fxmaster", data);
    return this.playVideo(data);
  }

  /** @override */
  _onDragLeftDrop(event) {
    const u = {
      x: event.data.destination.x - event.data.origin.x,
      y: event.data.destination.y - event.data.origin.y
    }
    const cos = u.x / Math.hypot(u.x, u.y);
    event.data.rotation = u.y > 0 ? Math.acos(cos) : -Math.acos(cos);
    this._drawSpecial(event);
  }

  /** @override */
  _onDragLeftStart(event) {
    this._dragging = true;
  }

  _onClickLeft(event) {
    this._dragging = false;
    setTimeout(() => {
      if (!this._dragging) {
        event.data.rotation = 0;
        this._drawSpecial(event)
      }
      this._dragging = false;
    }, 400)
  }

  /* -------------------------------------------- */
  /*  Methods
    /* -------------------------------------------- */

  activate() {
    super.activate();
    return this
  }

  deactivate() {
    super.deactivate();
    this.objects.visible = true;
  }

  async draw() {
    await super.draw();
    return this;
  }

  /** @override */
  tearDown() {
    for (const video of this.videos) {
      game.video.stop(video);
    }
    return super.tearDown();
  }
}
