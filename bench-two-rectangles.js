function BenchTwoRectangles(container, width, height, data, params) {
  var self, renderer, objects;

  return (self = {
    init: function () {
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
    },
  });
}

BenchTwoRectangles.version = Two.Version.replace("v", "");
BenchTwoRectangles.framework = "two";
BenchTwoRectangles.object = "rectangle";
BenchTwoRectangles.renderers = ["webgl", "canvas", "svg"];

Bench.list.push(BenchTwoRectangles);
