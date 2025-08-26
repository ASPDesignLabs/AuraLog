precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform int u_pointCount;
uniform vec3 u_points[10]; // reduced max points

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(
    abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
    6.0) - 3.0) - 1.0,
    0.0,
    1.0
  );
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(0.95, 0.95, 0.9); // background

  for (int i = 0; i < 10; i++) {
    if (i >= u_pointCount) break;

    vec2 point = u_points[i].xy;
    float startTime = u_points[i].z;

    float age = u_time - startTime;
    if (age > 1.2) continue; // shorter lifetime

    float dist = distance(uv, point);

    // Linear radius growth
    float radius = 0.01 + age * 0.05;

    // Cheaper falloff using smoothstep
    float intensity = smoothstep(radius, 0.0, dist);

    // Fade out over time
    float alpha = 1.0 - (age / 1.2);

    // Simple hue shift
    float hue = mod(u_time * 0.15 + uv.x, 1.0);
    vec3 rainbow = hsv2rgb(vec3(hue, 0.6, 1.0));

    color = mix(color, rainbow, intensity * alpha * 0.5);
  }

  gl_FragColor = vec4(color, 1.0);
}
