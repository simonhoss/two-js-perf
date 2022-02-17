function BenchTwoTweakRectangles(container, width, height, data, params) {
  var self, renderer, objects;

  var _identity, _toArray, _multiply, _scale;

  function tweak() {
    _identity = Two.Matrix.prototype.identity;
    _toArray = Two.Matrix.prototype.toArray;
    _multiply = Two.Matrix.prototype.multiply;
    _scale = Two.Matrix.prototype.scale;

    Backbone.Events.trigger = function () {};

    Two.Matrix.prototype.identity = function () {
      this.elements[0] = Two.Matrix.Identity[0];
      this.elements[1] = Two.Matrix.Identity[1];
      this.elements[2] = Two.Matrix.Identity[2];
      this.elements[3] = Two.Matrix.Identity[3];
      this.elements[4] = Two.Matrix.Identity[4];
      this.elements[5] = Two.Matrix.Identity[5];
      this.elements[6] = Two.Matrix.Identity[6];
      this.elements[7] = Two.Matrix.Identity[7];
      this.elements[8] = Two.Matrix.Identity[8];

      return this;
    };

    Two.Matrix.prototype.toArray = function (fullMatrix, output) {
      if (fullMatrix) {
        if (output) {
          output[0] = this.elements[0];
          output[1] = this.elements[3];
          output[2] = this.elements[6];
          output[3] = this.elements[1];
          output[4] = this.elements[4];
          output[5] = this.elements[7];
          output[6] = this.elements[2];
          output[7] = this.elements[5];
          output[8] = this.elements[8];
        } else {
          // ...
        }
      } else {
        if (output) {
          output[0] = this.elements[0];
          output[1] = this.elements[3];
          output[2] = this.elements[1];
          output[3] = this.elements[4];
          output[4] = this.elements[2];
          output[5] = this.elements[5];
        } else {
          // ...
        }
      }
    };

    Two.Matrix.prototype.multiply = function (a, b, c, d, e, f, g, h, i) {
      // Multiply scalar

      if (b === undefined) {
        _.each(
          this.elements,
          function (v, i) {
            this.elements[i] = v * a;
          },
          this
        );

        return this;
      }

      if (d === undefined) {
        // Multiply Vector

        var x, y, z;
        a = a || 0;
        b = b || 0;
        c = c || 0;
        e = this.elements;

        // Go down rows first
        // a, d, g, b, e, h, c, f, i

        x = e[0] * a + e[1] * b + e[2] * c;
        y = e[3] * a + e[4] * b + e[5] * c;
        z = e[6] * a + e[7] * b + e[8] * c;

        return { x: x, y: y, z: z };
      }

      // Multiple matrix

      var A = this.elements;
      var B = [a, b, c, d, e, f, g, h, i];

      var A0 = A[0],
        A1 = A[1],
        A2 = A[2];
      var A3 = A[3],
        A4 = A[4],
        A5 = A[5];
      var A6 = A[6],
        A7 = A[7],
        A8 = A[8];

      var B0 = B[0],
        B1 = B[1],
        B2 = B[2];
      var B3 = B[3],
        B4 = B[4],
        B5 = B[5];
      var B6 = B[6],
        B7 = B[7],
        B8 = B[8];

      this.elements[0] = A0 * B0 + A1 * B3 + A2 * B6;
      this.elements[1] = A0 * B1 + A1 * B4 + A2 * B7;
      this.elements[2] = A0 * B2 + A1 * B5 + A2 * B8;

      this.elements[3] = A3 * B0 + A4 * B3 + A5 * B6;
      this.elements[4] = A3 * B1 + A4 * B4 + A5 * B7;
      this.elements[5] = A3 * B2 + A4 * B5 + A5 * B8;

      this.elements[6] = A6 * B0 + A7 * B3 + A8 * B6;
      this.elements[7] = A6 * B1 + A7 * B4 + A8 * B7;
      this.elements[8] = A6 * B2 + A7 * B5 + A8 * B8;

      return this;
    };

    Two.Matrix.prototype.scale = function (sx, sy) {
      return this.multiply(sx, 0, 0, 0, sy !== undefined ? sy : sx, 0, 0, 0, 1);
    };
  }

  function untweak() {
    Two.Matrix.prototype.identity = _identity;
    Two.Matrix.prototype.toArray = _toArray;
    Two.Matrix.prototype.multiply = _multiply;
    Two.Matrix.prototype.scale = _scale;
  }

  return (self = {
    init: function () {
      tweak();

      renderer = Two.Instances.filter(function (d) {
        return (
          { webgl: "WebGLRenderer", canvas: "CanvasRenderer" }[
            params.renderer
          ] === d.type
        );
      })[0];

      renderer =
        renderer ||
        new Two({
          type: Two.Types[params.renderer],
          width: width,
          height: height,
        });

      renderer.appendTo(container.node());

      objects = [];

      for (var i = 0; i < data.length; i++) {
        var d = data[i];

        var o = renderer.makeRectangle(0, 0, d.w, d.h);

        o.fill = d.fillRgba;
        o.noStroke();

        objects.push(o);
      }

      self.update();
    },
    update: function () {
      for (var i = 0; i < data.length; i++) {
        var c = data[i];

        objects[i].translation.set(c.x, c.y);
      }

      renderer.update();
    },
    destroy: function () {
      objects = null;
      renderer.clear();

      if (params.renderer === "svg") {
        Two.Instances.pop();
      } else {
        // Garbage leftovers?
        renderer.scene.subtractions.splice(0);
      }

      renderer = null;

      untweak();
    },
  });
}

BenchTwoTweakRectangles.version = Two.Version.replace("v", "");
BenchTwoTweakRectangles.framework = "two-tweak";
BenchTwoTweakRectangles.object = "rectangle";
BenchTwoTweakRectangles.renderers = ["webgl", "canvas", "svg"];

Bench.list.push(BenchTwoTweakRectangles);
