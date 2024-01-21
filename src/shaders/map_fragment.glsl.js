export const map_fragment = /* GLSL */ `
/**
 * my created map_fragment
 */
#ifdef USE_MAP
        float m = 6.0;          // textures count
        float X = vMapUv.x * m; // 0.0 ~ 6.0
        float x = fract(X);     // 0.0 ~ 1.0
        float y = vMapUv.y;     // 0.0 ~ 1.0
        vec2 uv = vec2(x, y);
        x = x * 2.0 - 1.0;      // -1.0 ~ 1.0
        x = x * 3.0;            // -xxx ~ xxx
        x = sigmoid(x);         // 0.0 ~ 1.0

        vec4 sample0 = texture2D( textures[0], uv );
        vec4 sample1 = texture2D( textures[1], uv );
        vec4 sample2 = texture2D( textures[2], uv );
        vec4 sample3 = texture2D( textures[3], uv );
        vec4 sample4 = texture2D( textures[4], uv );
        vec4 sample5 = texture2D( textures[5], uv );
        vec4 col = vec4(0.0);

        if      (X < 1.0) col = mix(sample0, sample1, x);
        else if (X < 2.0) col = mix(sample1, sample2, x);
        else if (X < 3.0) col = mix(sample2, sample3, x);
        else if (X < 4.0) col = mix(sample3, sample4, x);
        else if (X < 5.0) col = mix(sample4, sample5, x);
        else              col = mix(sample5, sample0, x);

        diffuseColor *= col;
#endif

// default ShaderChunk map_fragment ↓
// #ifdef USE_MAP
//         vec4 sampledDiffuseColor = texture2D( map, vMapUv );
//
//         #ifdef DECODE_VIDEO_TEXTURE
//                 sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
//         #endif
//         diffuseColor *= sampledDiffuseColor;
// #endif
`;
