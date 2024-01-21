export const color_pars_fragment = /* GLSL */ `
/**
 * my created color_pars_fragment
 */
uniform float xxx;

#if defined( USE_COLOR_ALPHA )
        varying vec4 vColor;
#elif defined( USE_COLOR )
        varying vec3 vColor;
#endif
`;
