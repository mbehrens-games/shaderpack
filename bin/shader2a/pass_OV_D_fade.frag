#version 330 core

/* input variables (from vertex shader) */

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform float amount;

void main()
{
  /* construct output color */
  frag_color = vec3(0.0, 0.0, amount);
}
