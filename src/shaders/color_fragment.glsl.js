export const color_fragment = /* GLSL */ `
/**
 * my created color_fragment
 */
#if defined( USE_COLOR_ALPHA )
	      diffuseColor *= vColor;
#elif defined( USE_COLOR )
	      diffuseColor.rgb *= vColor;
#endif

diffuseColor.rgb *= xxx;
`;
