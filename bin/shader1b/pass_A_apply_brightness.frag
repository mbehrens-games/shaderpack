#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

uniform mat3  rgb2yiq_matrix;
uniform mat3  yiq2rgb_matrix;
uniform float black_level;
uniform float white_level;

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  vec2 center;
  vec3 sample;
  vec3 yiq_color;
  vec3 rgb_color;

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel */
  center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* obtain sample from texture */
  sample = texture(texture_sampler, center).xyz;

  /* convert from rgb to yiq */
  yiq_color = rgb2yiq_matrix * sample;

  /* clamp luma */
  yiq_color.x = clamp(yiq_color.x, 0.0, 1.0);

  /* apply brightness setting */
  yiq_color.x = mix(black_level, white_level, yiq_color.x);

  /* convert from yiq to rgb */
  rgb_color = yiq2rgb_matrix * yiq_color;

  /* final clamp */
  frag_color = clamp(rgb_color, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
}
