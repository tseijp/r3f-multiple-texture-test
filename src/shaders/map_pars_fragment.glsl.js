export const map_pars_fragment = /* GLSL */ `
/**
 * my created map_pars_fragment
 */
uniform sampler2D textures[6];

float sigmoid (float x) { return 1. / (1. + exp(-x)); } // -inf ~ inf => 0 ~ 1

#ifdef USE_MAP
        uniform sampler2D map;
#endif
`;
