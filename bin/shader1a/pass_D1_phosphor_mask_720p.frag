#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

uniform float mask_opacity;

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  vec2 center;
  vec3 sample;
  vec3 mask;

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel */
  center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* obtain sample from texture */
  sample = texture(texture_sampler, center).xyz;

  /* generate phosphor mask (720p) */
  if (mod(int(center.x * texture_dim.x), 2) == 0)
    mask = vec3(1.0, mask_opacity, 1.0);
  else
    mask = vec3(mask_opacity, 1.0, mask_opacity);

  /* apply phosphor mask */
  frag_color = clamp(sample * mask, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
}
