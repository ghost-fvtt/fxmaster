import { FXCanvasAnimation } from "../module/canvasanimation.js"
import { easeFunctions } from "../module/ease.js";

export class SpecialsLayer extends CanvasLayer {
  constructor() {
    super();
    this.specials = [];
  
    this.mouseInteractionManager = null;
    this._interactiveChildren = false;
    this._dragging = false;
    this.sortableChildren = true;

    this.options = this.constructor.layerOptions;

    // Listen to the socket
    game.socket.on("module.fxmaster", (data) => {
      this.playVideo(data);
    });

  }

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "specials",
      zIndex: 240,
    });
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
      var video = document.createElement("video");
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.src = data.file;
      video.playbackRate = data.playbackRate;

      // Create PIXI sprite
      var vidSprite;
      video.oncanplay = () => {
        const texture = PIXI.Texture.from(video);
        vidSprite = new PIXI.Sprite(texture);
        this.addChild(vidSprite);

        // Set values
        vidSprite.anchor.set(data.anchor.x, data.anchor.y);
        vidSprite.rotation = Math.normalizeRadians(data.rotation - Math.toRadians(data.angle));
        vidSprite.scale.set(data.scale.x, data.scale.y);
        vidSprite.position.set(data.position.x, data.position.y);

        if (data.width) { vidSprite.width = data.width; }

        if ((!data.speed || data.speed === 0) && !data.distance) {
          return;
        }
        if (data.distance && data.speed == "auto") {
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
        resolve();
        vidSprite?.destroy();
      }
    })
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
    const deltaX = target.x - origin.x
    const deltaY = target.y - origin.y
    effectData.rotation = Math.atan2(deltaY, deltaX)

    effectData.distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) - (1 - effectData.anchor.x) * tok2.width;

    // And to other clients
    game.socket.emit('module.fxmaster', effectData);
    // Throw effect locally
    return canvas.fxmaster.playVideo(effectData);
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
    this.playVideo(data);
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
    this.interactive = true;
    return this
  }

  async draw() {
    await super.draw();
    this._addListeners();
    return this;
  }


  _addListeners() {
    // Define callback functions for mouse interaction events
    const callbacks = {
      dragLeftStart: this._onDragLeftStart.bind(this),
      clickLeft: this._onClickLeft.bind(this),
      dragLeftDrop: this._onDragLeftDrop.bind(this),
      dragRightMove: canvas._onDragRightMove.bind(canvas),
    };

    // Create and activate the interaction manager
    const permissions = {};
    const mgr = new MouseInteractionManager(this, canvas.stage, permissions, callbacks);
    this.mouseInteractionManager = mgr.activate();
  }

  /** @override */
  tearDown() {
    for (let i = 0; i < this.specials.length; ++i) {
      this.specials[i].stop();
    }
    this.visible = false;
    return super.tearDown();
  }
}
