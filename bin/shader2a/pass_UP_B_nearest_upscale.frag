#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  vec2  center;

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel */
  center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* obtain sample from texture */
  frag_color = texture(texture_sampler, center).xyz;
}
