import { useLayoutEffect, useRef, useState } from "react";
import { useControls, button, buttonGroup } from "leva";
import { useGetCompiledShader } from "./hooks";
import {
  createModal,
  addOnBeforeCompile,
  group2material,
  decorateShader,
  replaceShader,
} from "./utils";

export const ShaderHelper = (props) => {
  const ref = useRef((group) => {
    if (!group) return;
    ref.current = group;
    const mat = group2material(ref.current);
    if (!mat) return;
    if (!mat.name) return console.warn("helpers Error: no name for material");

    addOnBeforeCompile(mat, (shader) => {
      replaceShader(shader, props);
      memo.shader = {
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
      };
      decorateShader(shader);
    });
  }).current;

  const getShader = useGetCompiledShader(ref);
  const [isOpen, setIsOpen] = useState(false);
  const [memo] = useState({ shader: {}, isOpen, listeners: [] });

  const close = () => memo.listeners.forEach((l) => l());
  const CLOSE = button(close, { disabled: !isOpen });

  const open = (code = "") => {
    const onClose = () => setIsOpen((memo.isOpen = false));
    const onClean = createModal(code, { onClose });
    close();
    setIsOpen((memo.isOpen = true));
    memo.listeners = [];
    memo.listeners.push(onClean);
  };

  useControls("SHADER HELPER", { CLOSE }, [isOpen]);
  useControls("SHADER HELPER", () => ({
    " ": buttonGroup({
      Frag: () => open(memo.shader.fragmentShader),
      Vert: () => open(memo.shader.vertexShader),
      _Frag: () => open(getShader(true)),
      _Vert: () => open(getShader(false)),
    }),
  }));

  return <group ref={ref} />;
};
