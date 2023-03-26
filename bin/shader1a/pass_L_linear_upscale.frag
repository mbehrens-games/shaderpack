#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
out vec4 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

void main()
{
  /* obtain sample from texture */
  frag_color = texture(texture_sampler, texcoord);
}
