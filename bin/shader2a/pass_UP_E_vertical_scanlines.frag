#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

#define ONE_OVER_SQRT_TWO_PI  0.398942280401433

/* the beam width (sigma) is 21/64 */
#define ONE_OVER_SIGMA  3.047619047619048

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  vec2  center;
  float mantissa;
  vec3  sample[5];
  float distance[5];
  float weight[5];
  vec3  rgb_color;

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel */
  center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* compute mantissa */
  mantissa = fract(texcoord.y * texture_dim.y);

  /* obtain samples from texture */
  sample[0] = texture(texture_sampler, center + vec2(0.0, (-1 + round(mantissa)) * texture_step.y)).xyz;
  sample[1] = texture(texture_sampler, center + vec2(0.0, ( 0 + round(mantissa)) * texture_step.y)).xyz;

  /* compute vertical distances from this output pixel to nearest scanlines */
  distance[0] = mix( 0.5 + mantissa, mantissa - 0.5, round(mantissa));
  distance[1] = mix( 0.5 - mantissa, (1.0 - mantissa) + 0.5, round(mantissa));

  /* compute weight of each scanline's contribution to this output pixel */
  weight[0] = exp(-0.5 * pow(distance[0] * ONE_OVER_SIGMA, 2.0)) * ONE_OVER_SIGMA * ONE_OVER_SQRT_TWO_PI;
  weight[1] = exp(-0.5 * pow(distance[1] * ONE_OVER_SIGMA, 2.0)) * ONE_OVER_SIGMA * ONE_OVER_SQRT_TWO_PI;

  /* compute output color for this pixel */
  rgb_color = weight[0] * sample[0] + weight[1] * sample[1];

  /* final clamp */
  frag_color = clamp(rgb_color, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
}
