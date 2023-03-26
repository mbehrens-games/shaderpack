#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

uniform float blur_filter[5];

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  vec2  center;
  vec3  sample;

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel */
  center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* sample center pixel */
  sample = texture(texture_sampler, center).xyz;
  sample *= blur_filter[2];

  /* apply blur filter */
  sample += texture(texture_sampler, center - vec2(2 * texture_step.x, 0.0)).xyz * blur_filter[0];
  sample += texture(texture_sampler, center - vec2(1 * texture_step.x, 0.0)).xyz * blur_filter[1];

  sample += texture(texture_sampler, center + vec2(2 * texture_step.x, 0.0)).xyz * blur_filter[0];
  sample += texture(texture_sampler, center + vec2(1 * texture_step.x, 0.0)).xyz * blur_filter[1];

  frag_color = clamp(sample, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
}
