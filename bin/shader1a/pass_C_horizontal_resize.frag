#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

uniform mat4 cubic_matrix;

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  vec2  center;
  float mantissa;
  vec4  powers;
  vec3  sample[4];

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel */
  center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* compute mantissa */
  mantissa = fract(texcoord.x * texture_dim.x);

  /* compute powers of the variable in the cubic polynomial */
  powers = vec4(pow(fract(0.5 + mantissa), 3.0), pow(fract(0.5 + mantissa), 2.0), fract(0.5 + mantissa), 1.0);

  /* obtain samples from texture */
  sample[0] = texture(texture_sampler, center + vec2((-2 + round(mantissa)) * texture_step.x, 0.0)).xyz;
  sample[1] = texture(texture_sampler, center + vec2((-1 + round(mantissa)) * texture_step.x, 0.0)).xyz;
  sample[2] = texture(texture_sampler, center + vec2(( 0 + round(mantissa)) * texture_step.x, 0.0)).xyz;
  sample[3] = texture(texture_sampler, center + vec2(( 1 + round(mantissa)) * texture_step.x, 0.0)).xyz;

  /* compute final output color for this pixel */
  frag_color = clamp( (transpose(cubic_matrix * transpose(mat4x3(sample[0], sample[1], sample[2], sample[3]))) * powers).xyz, 
                      vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
}
