import { FXCanvasAnimation } from "../module/canvasanimation.js"
import { easeFunctions } from "../module/ease.js";

export class FXMasterLayer extends PlaceablesLayer {
  constructor() {
    super();
    this.effects = {};
    this.weather = null;
    this.specials = [];
    this.loader = new PIXI.Loader();

    // Listen to the socket
    game.socket.on("module.fxmaster", (data) => {
      this.playVideo(data);
    });
  }

  static get layerOptions() {
    return mergeObject(super.layerOptions, {
      objectClass: Note,
      sheetClass: NoteConfig,
      canDragCreate: false,
      zIndex: 180
    });
  }

  playVideo(data) {
    // Set default values
    data = mergeObject({
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
      vidSprite.rotation = normalizeRadians(data.rotation - toRadians(data.angle));
      vidSprite.scale.set(data.scale.x, data.scale.y);
      vidSprite.position.set(data.position.x, data.position.y);

      if ((!data.speed || data.speed === 0) && !data.distance) {
        return;
      }
      if (data.distance) {
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
      animationDuration -= Math.max(0, 1000 * (data.animationDelay.end + data.animationDelay.start));
      const animate = function () {
        FXCanvasAnimation.animateSmooth(attributes, {
          name: `fxmaster.video.${randomID()}.move`,
          context: this,
          duration: animationDuration,
          ease: easeFunctions[data.ease]
        })
      }
      if (hasProperty(data, "animationDelay.start")) {
        setTimeout(animate, data.animationDelay.start * 1000.0);
      } else {
        animate();
      }
    };

    video.onerror = () => {
      this.removeChild(vidSprite);
      vidSprite.destroy();
    }
    video.onended = () => {
      this.removeChild(vidSprite);
      vidSprite.destroy();
    }
  }

  getSpecialData(folder, id) {
    if (folder == "custom") {
      const effectData = game.settings.get('fxmaster', 'specialEffects')[0]
      return effectData[id];
    }
    return CONFIG.fxmaster.specials[folder].effects[id]
  }

  drawSpecialToward(effect, tok1, tok2) {
    const origin = {
      x: tok1.position.x + tok1.w / 2,
      y: tok1.position.y + tok1.h / 2
    }
    const effectData = mergeObject(effect, {
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

    // Throw effect locally
    canvas.fxmaster.playVideo(effectData);
    // And to other clients
    game.socket.emit('module.fxmaster', effectData);
  }

  _drawSpecial(event) {
    const windows = Object.values(ui.windows);
    const effectConfig = windows.find((w) => w.id == "specials-config");
    if (!effectConfig) return;
    const active = effectConfig.element.find(".active");
    if (active.length == 0) return;

    const id = active[0].dataset.effectId;
    const folder = active[0].closest(".folder").dataset.folderId;
    const effect = this.getSpecialData(folder, id);
    let data = mergeObject(effect, {
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
    // Skipping Placeable Layers activate method
    // super.activate();
    CanvasLayer.prototype.activate.apply(this)
    return this
  }

  deactivate() {
    // Skipping Placeable Layers deactivate method
    // super.deactivate();
    CanvasLayer.prototype.deactivate.apply(this)
    return this
  }

  async draw() {
    super.draw();
  }

  /* -------------------------------------------- */

  updateMask() {
    this.visible = true;
    // Setup scene mask
    if (this.mask) this.removeChild(this.mask);
    this.mask = new PIXI.Graphics();
    this.addChild(this.mask);
    const d = canvas.dimensions;
    this.mask.beginFill(0xffffff);
    if (canvas.background.img) {
      this.mask.drawRect(
        d.paddingX - d.shiftX,
        d.paddingY - d.shiftY,
        d.sceneWidth,
        d.sceneHeight
      );
    } else {
      this.mask.drawRect(0, 0, d.width, d.height);
    }
  }

  /** @override */
  tearDown() {
    this.weather = null;
    for (let i = 0; i < this.specials.length; ++i) {
      this.specials[i].stop();
    }
    const effKeys = Object.keys(this.effects);
    for (let i = 0; i < effKeys.length; ++i) {
      this.effects[effKeys[i]].fx.stop();
      delete this.effects[effKeys[i]];
    }
    this.visible = false;
    return super.tearDown();
  }

  drawWeather() {
    if (this.weather) {
      this.removeChild(this.weather);
    }
    this.weather = this.addChild(new PIXI.Container());
    const effKeys = Object.keys(this.effects);
    for (let i = 0; i < effKeys.length; ++i) {
      this.effects[effKeys[i]].fx.stop();
    }
    this.effects = {};

    // Updating scene weather
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    if (flags) {
      const keys = Object.keys(flags);
      for (let i = 0; i < keys.length; ++i) {
        this.effects[keys[i]] = {
          type: flags[keys[i]].type,
          fx: new CONFIG.weatherEffects[flags[keys[i]].type](this.weather),
        };
        this.configureEffect(keys[i]);
        this.effects[keys[i]].fx.play();
      }
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    if (!flags || !flags[id]) return;

    // Adjust density
    if (hasProperty(flags[id], "options.density")) {
      let factor = (2 * flags[id].options.density) / 100;
      this.effects[id].fx.emitters.forEach((el) => {
        el.frequency *= factor;
        el.maxParticles *= factor;
      });
    }

    // Adjust scale
    if (hasProperty(flags[id], "options.scale")) {
      let factor = (2 * flags[id].options.scale) / 100;
      this.effects[id].fx.emitters.forEach((el) => {
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
      this.effects[id].fx.emitters.forEach((el) => {
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
      this.effects[id].fx.emitters.forEach((el) => {
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
      this.effects[id].fx.emitters.forEach((el) => {
        el.minStartRotation += factor;
        el.maxStartRotation += factor;
      });
    }
  }
}
