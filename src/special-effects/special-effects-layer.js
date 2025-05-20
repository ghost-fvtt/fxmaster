import { packageId } from "../constants.js";
import { easeFunctions } from "../ease.js";
import { SpecialEffectMesh } from "./mesh.js";

export class SpecialEffectsLayer extends foundry.canvas.layers.InteractionLayer {
  constructor() {
    super();
    this.videos = [];
    this._dragging = false;
    this.ruler = null;
    this.windowVisible = false;
    // Listen to the socket
    game.socket.on(`module.${packageId}`, (data) => {
      this.playVideo(data);
    });
  }

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "specials",
      zIndex: 245,
    });
  }

  /** @override */
  async _draw() {
    await super._draw();
    this.ruler = this.addChild(new PIXI.Graphics());
  }

  /** @inheritdoc */
  async _tearDown() {
    this.ruler = null;
    for (const video of this.videos) {
      video.remove();
    }
    this.videos = [];
    return super._tearDown();
  }

  _configureProjectile(mesh, data) {
    if (data.distance && (!data.speed || data.speed == "auto")) {
      data.speed = data.distance / data.duration;
    }
    // Compute final position
    const delta = data.duration * data.speed;
    const deltaX = delta * Math.cos(data.rotation);
    const deltaY = delta * Math.sin(data.rotation);

    // Move the sprite
    const attributes = [
      {
        parent: mesh,
        attribute: "x",
        to: data.position.x + deltaX,
      },
      {
        parent: mesh,
        attribute: "y",
        to: data.position.y + deltaY,
      },
    ];

    let animationDuration = data.duration * 1000;
    if (foundry.utils.hasProperty(data, "animationDelay")) {
      animationDuration -= Math.max(0, 1000 * (data.animationDelay.end + data.animationDelay.start));
    }
    const animationName = `${packageId}.video.${foundry.utils.randomID()}.move`;
    const animate = function () {
      CanvasAnimation.animate(attributes, {
        name: animationName,
        context: this,
        duration: animationDuration,
        easing: easeFunctions[data.ease],
      });
    };
    if (foundry.utils.hasProperty(data, "animationDelay.start")) {
      setTimeout(animate, data.animationDelay.start * 1000.0);
    } else {
      animate();
    }
    return () => CanvasAnimation.terminateAnimation(animationName);
  }

  _configureRotate(mesh, data) {
    const attributes = [
      {
        parent: mesh,
        attribute: "angle",
        to: 90 * data.rotationSpeed,
      },
    ];
    let animationDuration = data.duration * 1000;
    if (foundry.utils.hasProperty(data, "animationDelay")) {
      animationDuration -= Math.max(0, 1000 * (data.animationDelay.end + data.animationDelay.start));
    }
    const animationName = `${packageId}.video.${foundry.utils.randomID()}.rotate`;

    const animate = function () {
      CanvasAnimation.animate(attributes, {
        name: animationName,
        context: this,
        duration: animationDuration,
        easing: easeFunctions[data.ease],
      });
    };
    if (foundry.utils.hasProperty(data, "animationDelay.start")) {
      setTimeout(animate, data.animationDelay.start * 1000.0);
    } else {
      animate();
    }
    return () => CanvasAnimation.terminateAnimation(animationName);
  }

  #configureSpecialEffectMesh(mesh, data) {
    mesh.anchor.set(data.anchor.x, data.anchor.y);
    mesh.rotation = Math.normalizeRadians(data.rotation - Math.toRadians(data.angle));
    mesh.scale.set(data.scale.x, data.scale.y);
    mesh.position.set(data.position.x, data.position.y);
    mesh.elevation = data.elevation ?? 1;

    if (data.width) {
      if (data.keepAspect) {
        const aspectRatio = mesh.height / mesh.width;
        mesh.height = data.width * aspectRatio;
      }
      mesh.width = data.width;
    }

    /** @type {(() => void) | undefined} */
    let terminateMovementAnimation;
    if (data.speed || data.distance) {
      terminateMovementAnimation = this._configureProjectile(mesh, data);
    }
    /** @type {(() => void) | undefined} */
    let terminateRotationtAnimation;
    if (data.rotationSpeed) {
      terminateRotationtAnimation = this._configureRotate(mesh, data);
    }

    return () => {
      terminateMovementAnimation?.();
      terminateRotationtAnimation?.();
    };
  }

  playVideo(data) {
    return new Promise((resolve) => {
      // Set default values
      data = foundry.utils.mergeObject(
        {
          anchor: { x: 0.5, y: 0.5 },
          rotation: 0,
          scale: { x: 1.0, y: 1.0 },
          position: { x: 0, y: 0 },
          playbackRate: 1.0,
          ease: "Linear",
        },
        data,
      );

      // Create video
      const video = document.createElement("video");
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.src = data.file;
      video.playbackRate = data.playbackRate;
      this.videos.push(video);

      /** @type {SpriteMesh | undefined} */
      let mesh;
      /** @type {(() => void) | undefined} */
      let terminateAnimation;

      const onCanPlay = () => {
        mesh = new SpecialEffectMesh(PIXI.Texture.from(video));

        data.dimensions = { w: video.videoWidth, h: video.videoHeight };
        data.duration = video.duration;
        terminateAnimation = this.#configureSpecialEffectMesh(mesh, data);

        canvas.primary.addChild(mesh);
        canvas.primary.videoMeshes.add(mesh);
      };

      const onEnd = () => {
        terminateAnimation?.();
        canvas.primary.removeChild(mesh);
        canvas.primary.videoMeshes.delete(mesh);
        resolve();
        if (!mesh?._destroyed) mesh?.destroy({ children: true });
      };

      video.oncanplay = onCanPlay;
      video.onerror = onEnd;
      video.onended = onEnd;
    });
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
        game.socket.emit("module.${packageId}", data);
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
        game.socket.emit("module.${packageId}", data);
      })

    `;
  }

  drawSpecialToward(effect, tok1, tok2) {
    const origin = {
      x: tok1.position.x + tok1.w / 2,
      y: tok1.position.y + tok1.h / 2,
    };
    const effectData = foundry.utils.mergeObject(effect, {
      position: {
        x: origin.x,
        y: origin.y,
      },
    });
    const target = {
      x: tok2.position.x + tok2.w / 2,
      y: tok2.position.y + tok2.h / 2,
    };
    // Compute angle
    const ray = new Ray(origin, target);
    effectData.distance = ray.distance;
    effectData.rotation = ray.angle;
    // Play to other clients
    game.socket.emit(`module.${packageId}`, effectData);
    // Play effect locally
    return this.playVideo(effectData);
  }

  drawFacing(effect, tok1, tok2) {
    const origin = {
      x: tok1.position.x + tok1.w / 2,
      y: tok1.position.y + tok1.h / 2,
    };
    const effectData = foundry.utils.mergeObject(effect, {
      position: {
        x: origin.x,
        y: origin.y,
      },
    });
    const target = {
      x: tok2.position.x + tok2.w / 2,
      y: tok2.position.y + tok2.h / 2,
    };
    // Compute angle
    const ray = new Ray(origin, target);
    effectData.rotation = ray.angle;
    // Play to other clients
    game.socket.emit(`module.${packageId}`, effectData);
    // Play effect locally
    return this.playVideo(effectData);
  }

  /**
   * Draw a special effect.
   * @param {PIXI.InteractionEvent} event         The event that triggered the drawing of the special effect
   * @param {PIXI.Point}            [savedOrigin] The point that was originally clicked on
   * @returns {Promise<void>}
   * @remarks
   * The savedOrigin parameter is required for regular click events because for some reason, the origin has been removed
   * from the event's data by the time the event is handled.
   * TODO: investigate further.
   */
  _drawSpecial(event, savedOrigin) {
    event.stopPropagation();

    const windows = Object.values(ui.windows);
    const effectConfig = windows.find((w) => w.id == "specials-config");
    if (!effectConfig) return;
    const active = effectConfig.element.find(".special-effects.active");
    if (active.length == 0) return;

    const id = active[0].dataset.effectId;
    const folder = active[0].closest(".folder").dataset.folderId;
    const effect = CONFIG.fxmaster.userSpecials[folder].effects[id];

    const effectData = foundry.utils.deepClone(effect);
    const { x, y } = event.interactionData.origin ?? savedOrigin;
    const data = {
      ...effectData,
      position: { x, y },
      rotation: event.interactionData.rotation,
      elevation: this.#elevation,
    };

    if (!event.interactionData.destination) {
      game.socket.emit(`module.${packageId}`, data);
      return this.playVideo(data);
    }

    // Handling different casting modes
    const actionToggle = effectConfig.element.find(".action-toggle.active a");
    const mode = actionToggle[0].dataset.action;
    const ray = new Ray(event.interactionData.origin, event.interactionData.destination);
    switch (mode) {
      case "cast-throw":
        data.distance = ray.distance;
        data.speed = "auto";
        break;
      case "cast-extend":
        data.width = ray.distance || data.width;
        data.speed = 0;
        break;
      case "cast-expand":
        data.width = ray.distance || data.width;
        data.keepAspect = true;
        data.speed = 0;
        break;
      case "cast-rotate":
        data.rotationSpeed = ray.distance / canvas.grid[game.release.generation >= 12 ? "sizeX" : "w"];
        data.speed = 0;
        break;
      case "cast-static":
        break;
    }

    game.socket.emit(`module.${packageId}`, data);
    return this.playVideo(data);
  }

  /** @override */
  _onDragLeftDrop(event) {
    const u = {
      x: event.interactionData.destination.x - event.interactionData.origin.x,
      y: event.interactionData.destination.y - event.interactionData.origin.y,
    };
    const cos = u.x / Math.hypot(u.x, u.y);
    event.interactionData.rotation = u.y > 0 ? Math.acos(cos) : -Math.acos(cos);
    this._drawSpecial(event);
    this.ruler.clear();
  }

  /** @override */
  _onDragLeftStart() {
    this.windowVisible = this._isWindowVisible();
    if (!this.windowVisible) return;
    this._dragging = true;
  }

  /** @override */
  _onDragLeftMove(event) {
    if (!this.windowVisible) return;
    const ray = new Ray(event.interactionData.origin, event.interactionData.destination);
    this.ruler.clear();
    this.ruler
      .lineStyle(3, 0xaa0033, 0.6)
      .drawCircle(ray.A.x, ray.A.y, 2)
      .moveTo(ray.A.x, ray.A.y)
      .lineTo(ray.B.x, ray.B.y)
      .drawCircle(ray.B.x, ray.B.y, 2);
  }

  _isWindowVisible() {
    const windows = Object.values(ui.windows);
    const effectConfig = windows.find((w) => w.id == "specials-config");
    if (!effectConfig) return false;
    return true;
  }

  /** @override */
  _onClickLeft(event) {
    this._dragging = false;
    const origin = event.interactionData.origin;
    setTimeout(() => {
      if (!this._dragging) {
        event.interactionData.rotation = 0;
        event.interactionData.destination = undefined;
        this._drawSpecial(event, origin);
      }
      this._dragging = false;
    }, 400);
  }

  get #elevation() {
    const effectConfig = Object.values(ui.windows).find((w) => w.id == "specials-config");
    const elevationString = effectConfig?.element.find("input[name='elevation']").val();
    const elevation = Number.parseFloat(elevationString);
    if (Number.isNaN(elevation) || !Number.isFinite(elevation)) return 1;
    return elevation;
  }
}
