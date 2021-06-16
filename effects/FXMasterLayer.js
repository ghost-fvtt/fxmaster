import { FXCanvasAnimation } from "../module/canvasanimation.js"
import { easeFunctions } from "../module/ease.js";

export class FXMasterLayer extends CanvasLayer {
  constructor() {
    super();
    this.weatherEffects = {};
    this.weather = null;
    this.specials = [];
    this.loader = new PIXI.Loader();

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
      name: "fxmaster",
      zIndex: 250,
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
    canvas.fxmaster.playVideo(data);
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

  /* -------------------------------------------- */

  updateMask() {
    this.visible = true;
    if (!this.weather) return;

    // Mask zones masked by drawings
    const mask = new PIXI.Graphics();
    this.weather.addChild(mask);

    if (this.weather.mask) {
      this.weather.removeChild(this.weather.mask);
      this.weather.mask = null;
    }

    const sceneShape = canvas.scene.img ? canvas.dimensions.sceneRect.clone() : canvas.dimensions.rect.clone();
    mask.beginFill(0x000000).drawShape(sceneShape).endFill();

    canvas.drawings.placeables.forEach((drawing) => {
      const isMask = drawing.document.getFlag("fxmaster", "masking");
      if (!isMask) return;
      mask.beginHole();
      const shape = drawing.shape.geometry.graphicsData[0].shape.clone();
      switch (drawing.data.type) {
        case CONST.DRAWING_TYPES.ELLIPSE:
          shape.x = drawing.center.x;
          shape.y = drawing.center.y;
          mask.drawShape(shape);
          break;
        case CONST.DRAWING_TYPES.POLYGON:
        case CONST.DRAWING_TYPES.FREEHAND:
          const points = drawing.data.points.reduce((acc, v) => {
            acc.push(v[0] + drawing.x, v[1] + drawing.y);
            return acc;
          }, [])
          mask.drawPolygon(points);
          break;
        default:
        shape.x = drawing.x;
        shape.y = drawing.y;
        mask.drawShape(shape);
      }
      mask.endHole();
    });
    Hooks.callAll("updateMask", this, this.weather, mask);
    this.weather.mask = mask;
  }

  /** @override */
  tearDown() {
    for (let i = 0; i < this.specials.length; ++i) {
      this.specials[i].stop();
    }
    const effKeys = Object.keys(this.weatherEffects);
    for (let i = 0; i < effKeys.length; ++i) {
      this.weatherEffects[effKeys[i]].fx.stop();
    }
    if (this.weather) {
      this.removeChild(this.weather);
      this.weather = null;
    }
    this.weatherEffects = {};
    this.visible = false;
    return super.tearDown();
  }

  async drawWeather(options = {}) {
    if (!this.weather) {
      this.weather = this.addChild(new PIXI.Container());
    }
    Hooks.callAll("drawWeather", this, this.weather, this.weatherEffects);
    
    const effKeys = Object.keys(this.weatherEffects);
    for (let i = 0; i < effKeys.length; ++i) {
      if (options.soft === true) {
        for (let ef of this.weatherEffects[effKeys[i]].fx.emitters) {
          ef.emitterLifetime = 0.1;
          ef.playOnceAndDestroy(() => {
            delete this.weatherEffects[effKeys[i]];
          });
        }
      } else {
        this.weatherEffects[effKeys[i]].fx.stop();
        delete this.weatherEffects[effKeys[i]];
      }
    }

    // Updating scene weather
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    if (flags) {
      const keys = Object.keys(flags);
      for (let i = 0; i < keys.length; ++i) {
        this.weatherEffects[keys[i]] = {
          type: flags[keys[i]].type,
          fx: new CONFIG.weatherEffects[flags[keys[i]].type](this.weather),
        };
        this.configureEffect(keys[i]);
        this.weatherEffects[keys[i]].fx.play();
      }
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    if (!flags || !flags[id]) return;

    // Adjust density
    if (hasProperty(flags[id], "options.density")) {
      let factor = (2 * flags[id].options.density) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.frequency *= factor;
        el.maxParticles *= factor;
      });
    }

    // Adjust scale
    if (hasProperty(flags[id], "options.scale")) {
      let factor = (2 * flags[id].options.scale) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.startScale.value *= factor;
        let node = el.startScale.next;
        while (node) {
          node.value *= factor;
          node = node.next;
        }
      });
    }

    // Adjust speed
    if (hasProperty(flags[id], "options.speed")) {
      let factor = (2 * flags[id].options.speed) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.startSpeed.value *= factor;
        let node = el.startSpeed.next;
        while (node) {
          node.value *= factor;
          node = node.next;
        }
      });
    }

    // Adjust tint
    if (
      hasProperty(flags[id], "options.apply_tint") &&
      flags[id].options.apply_tint == true
    ) {
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        let colors = hexToRGB(colorStringToHex(flags[id].options.tint));
        el.startColor.value = {
          r: colors[0] * 255,
          g: colors[1] * 255,
          b: colors[2] * 255,
        };
        let node = el.startColor.next;
        while (node) {
          node.value = el.startColor.value;
          node = node.next;
        }
      });
    }

    // Adjust direction
    if (hasProperty(flags[id], "options.direction")) {
      let factor = (360 * (flags[id].options.direction - 50)) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.minStartRotation += factor;
        el.maxStartRotation += factor;
      });
    }
  }
}
