#version 330 core

/* input variables */
layout (location = 0) in vec3   vertex_position;
layout (location = 1) in vec2   vertex_texture_coord;
layout (location = 2) in float  vertex_palette_coord;

/* output variables */
out vec2  texture_coord;
out float palette_coord;

/* uniform variables */
uniform mat4 mvp_matrix;

void main()
{
  /* multiply by modelviewprojection matrix */
  gl_Position = mvp_matrix * vec4(vertex_position, 1.0);

  /* pass through texture coordinates and palette coordinates */
  texture_coord = vertex_texture_coord;
  palette_coord = vertex_palette_coord;
}
