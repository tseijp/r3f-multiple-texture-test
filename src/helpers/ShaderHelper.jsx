import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState } from "react";
import { useControls, button, buttonGroup } from "leva";

const modalStyle = {
  top: 0,
  left: 0,
  margin: 0,
  zIndex: 100,
  display: "flex",
  position: "fixed",
  backdropFilter: "blur(5px)",
  color: "#fff",
  width: "100vw",
  height: "100vh",
  gap: "2rem",
  padding: "5rem 10rem 10rem 5rem",
  boxSizing: "border-box",
  overflow: "scroll",
  background: "rgba(21, 21, 21, 0.8)",
};

const openModal = (code, props = {}) => {
  const { onClose = () => {} } = props;
  const handleClose = () => {
    modal.remove();
    onClose();
  };

  // open element
  const modal = document.createElement("pre");
  const text = document.createTextNode(code);
  Object.assign(modal.style, modalStyle);
  modal.addEventListener("dblclick", handleClose);
  modal.appendChild(text);
  document.body.appendChild(modal);

  return handleClose;
};

const group2material = (group) => {
  const mesh = group.parent;
  if (!mesh) return;
  let mat = mesh.material;
  if (!mat) return;
  if (Array.isArray(mat)) mat = mat[0];
  if (!mat.name)
    return console.warn("ShaderHelper Error: no name for material");
  return mat;
};

const useGetCompiledShader = (ref) => {
  return useThree((state) => {
    const { gl, scene, camera } = state;

    return (isFrag = false) => {
      gl.compile(scene, camera);

      for (const pg of gl.info.programs) {
        const mat = group2material(ref.current);
        if (!mat) returnl;
        if (pg.name !== mat.name) continue;
        const shader = isFrag ? pg.fragmentShader : pg.vertexShader;
        return gl.getContext().getShaderSource(shader);
      }
    };
  });
};

export const ShaderHelper = () => {
  const ref = useRef();
  const getShader = useGetCompiledShader(ref);
  const [isOpen, setIsOpen] = useState(false);
  const [memo] = useState({ shader: {}, isOpen, listeners: [] });

  const close = () => memo.listeners.forEach((l) => l());
  const CLOSE = button(close, { disabled: !isOpen });

  const open = (code = "") => {
    const onClose = () => setIsOpen((memo.isOpen = false));
    const onClean = openModal(code, { onClose });
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

  useLayoutEffect(() => {
    const mat = group2material(ref.current);
    if (!mat) return;
    const _onBeforeCompile = mat.onBeforeCompile;
    const onBeforeCompile = (shader, renderer) => {
      _onBeforeCompile(shader, renderer);
      memo.shader = {
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
      };
      decorate(shader);
    };
    mat.onBeforeCompile = onBeforeCompile;
  }, []);

  return <group ref={ref} />;
};

/**
 * utils
 */

const vert = (shader, ...args) => {
  shader.vertexShader = shader.vertexShader.replace(...args);
};

const frag = (shader, ...args) => {
  shader.fragmentShader = shader.fragmentShader.replace(...args);
};

const withComment = (line = "") => {
  const decoration = "*".repeat(line.length + 8);
  return `
/**${decoration}
 *    ${line}    *
 **${decoration}/

${line}
`;
};

const decorate = (shader) => {
  shader.vertexShader.split("\n").forEach((line) => {
    if (line.includes("#include")) vert(shader, line, withComment(line));
  });
  shader.fragmentShader.split("\n").forEach((line) => {
    if (line.includes("#include")) frag(shader, line, withComment(line));
  });
};
