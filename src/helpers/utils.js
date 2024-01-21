/**
 * Modal
 */
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

export const createModal = (code, props = {}) => {
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

/**
 * shader utils
 */

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

export const decorateShader = (shader) => {
  shader.vertexShader.split("\n").forEach((line) => {
    if (line.includes("#include")) vert(shader, line, withComment(line));
  });
  shader.fragmentShader.split("\n").forEach((line) => {
    if (line.includes("#include")) frag(shader, line, withComment(line));
  });
};

export const replaceShader = (shader, props) => {
  for (const key in props) {
    const value = props[key];
    const line = `#include <${key}>`;
    const isFrag = key.includes("fragment");
    const isVert = key.includes("vertex");
    if (!isVert) frag(shader, line, value);
    if (!isFrag) vert(shader, line, value);
  }
};

/**
 * r3f
 */
export const group2material = (group) => {
  const mesh = group.parent;
  if (!mesh) return;
  let mat = mesh.material;
  if (!mat) return;
  if (Array.isArray(mat)) mat = mat[0];
  return mat;
};

const listeners = new WeakMap();

export const attachListeners = (mat) => {
  const set = new Set();
  listeners.set(mat, set);
  set.add(mat.onBeforeCompile.bind(mat));
  mat.onBeforeCompile = (...args) => {
    set.forEach((f) => f(...args));
  };
};

export const addOnBeforeCompile = (mat, callback) => {
  if (!listeners.has(mat)) attachListeners(mat);
  listeners.get(mat).add(callback);
};

/**
 * leva
 */
const _onChange = (key, ref) => {
  let i = 0;
  const onChange = (value) => {
    if (i <= 0 || !ref.current) return i++;
    const mat = group2material(ref.current);
    const uniform = mat.uniforms[key];
    if (!uniform) return;
    uniform.value = value;
  };

  return onChange;
};
export const props2config = (props, ref) => {
  const ret = {};

  for (const key in props) {
    const value = props[key];
    ret[key] = { value, onChange: _onChange(key, ref) };
  }

  return ret;
};

export const props2uniforms = (config) => {
  const ret = {};

  for (const key in config) {
    const value = config[key];
    ret[key] = { value };
  }

  return ret;
};
