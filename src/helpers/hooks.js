import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { group2material, props2config, props2uniforms } from "./utils";

/**
 * for ShaderHelpers
 */
export const useGetCompiledShader = (ref) => {
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

/**
 * for UniformHelpers
 */
export const useUniformControls = (props, ref) => {
  const config = props2config(props, ref);
  const uniforms = props2uniforms(props);
  useControls(config);
  return uniforms;
};
