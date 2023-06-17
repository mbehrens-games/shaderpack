/*******************************************************************************
** SHADERPACK (Shader Packer) - Michael Behrens 2023
*******************************************************************************/

/*******************************************************************************
** main.c
*******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum
{
  SOURCE_SHADER_1A = 0,
  SOURCE_SHADER_1B,
  SOURCE_SHADER_2A,
  SOURCE_SHADER_2Z
};

int G_source;

#define WRITE_VERTEX_OR_FRAGMENT_SHADER_TO_FILE(folder, filename, extension)        \
  /* open shader input file */                                                      \
  fp_in = fopen(#folder "/" #filename "." #extension, "rb");                        \
                                                                                    \
  /* if file did not open, return */                                                \
  if (fp_in == NULL)                                                                \
  {                                                                                 \
    printf("Unable to open file " #filename "." #extension ". Exiting...\n");       \
    fclose(fp_out);                                                                 \
    return 0;                                                                       \
  }                                                                                 \
                                                                                    \
  /* determine size of shader source code */                                        \
  source_length = 0;                                                                \
                                                                                    \
  while (fread(&tmp_char, 1, 1, fp_in) == 1)                                        \
    source_length += 1;                                                             \
                                                                                    \
  /* allocate shader source code buffer */                                          \
  source_buffer = malloc(sizeof(char) * (unsigned int) source_length);              \
                                                                                    \
  /* read shader source code into buffer */                                         \
  fseek(fp_in, 0, SEEK_SET);                                                        \
                                                                                    \
  if (fread(source_buffer, 1, source_length, fp_in) < (unsigned int) source_length) \
  {                                                                                 \
    printf("Failed to read shader file: " #filename "." #extension "\n");           \
    return 1;                                                                       \
  }                                                                                 \
                                                                                    \
  /* close shader source code */                                                    \
  fclose(fp_in);                                                                    \
                                                                                    \
  /* write shader to output file */                                                 \
  fwrite(&source_length, 4, 1, fp_out);                                             \
  fwrite(source_buffer, 1, source_length, fp_out);                                  \
                                                                                    \
  /* cleanup */                                                                     \
  if (source_buffer != NULL)                                                        \
  {                                                                                 \
    free(source_buffer);                                                            \
    source_buffer = NULL;                                                           \
    source_length = 0;                                                              \
  }

#define WRITE_SHADERS_TO_FILE(folder, filename)                                \
  WRITE_VERTEX_OR_FRAGMENT_SHADER_TO_FILE(folder, filename, vert)              \
  WRITE_VERTEX_OR_FRAGMENT_SHADER_TO_FILE(folder, filename, frag)              \

/*******************************************************************************
** main()
*******************************************************************************/
int main(int argc, char *argv[])
{
  int             i;

  FILE*           fp_in;
  FILE*           fp_out;

  char            signature[8];

  char            tmp_char;
  short int       tmp_int;

  char*           source_buffer;
  int             source_length;

  /* initialize variables */
  fp_in = NULL;
  fp_out = NULL;

  for (i = 0; i < 8; i++)
    signature[i] = '\0';

  tmp_char = 0;
  tmp_int = 0;

  source_buffer = NULL;
  source_length = 0;

  /* read command line arguments */
  i = 1;

  while (i < argc)
  {
    /* source */
    if (!strcmp(argv[i], "-s"))
    {
      i++;

      if (i >= argc)
      {
        printf("Insufficient number of arguments. ");
        printf("Expected source name. Exiting...\n");
        return 0;
      }

      if (!strcmp("shader1a", argv[i]))
        G_source = SOURCE_SHADER_1A;
      else if (!strcmp("shader1b", argv[i]))
        G_source = SOURCE_SHADER_1B;
      else if (!strcmp("shader2a", argv[i]))
        G_source = SOURCE_SHADER_2A;
      else if (!strcmp("shader2z", argv[i]))
        G_source = SOURCE_SHADER_2Z;
      else
      {
        printf("Unknown source %s. Exiting...\n", argv[i]);
        return 0;
      }

      i++;
    }
    else
    {
      printf("Unknown command line argument %s. Exiting...\n", argv[i]);
      return 0;
    }
  }

  /* open output file */
  if (G_source == SOURCE_SHADER_1A)
    fp_out = fopen("shader1a.dat", "wb");
  else if (G_source == SOURCE_SHADER_1B)
    fp_out = fopen("shader1b.dat", "wb");
  else if (G_source == SOURCE_SHADER_2A)
    fp_out = fopen("shader2a.dat", "wb");
  else if (G_source == SOURCE_SHADER_2Z)
    fp_out = fopen("shader2z.dat", "wb");
  else
  {
    printf("Unknown source. Exiting...\n");
    return 0;
  }

  /* if file did not open, return */
  if (fp_out == NULL)
  {
    printf("Unable to open output file. Exiting...\n");
    return 0;
  }

  /* write shader file! */
  if (G_source == SOURCE_SHADER_1A)
  {
    /* write signature */
    signature[0] = 'S';
    signature[1] = 'H';
    signature[2] = 'A';
    signature[3] = 'D';
    signature[4] = 'E';
    signature[5] = 'R';
    signature[6] = '1';
    signature[7] = 'A';

    fwrite(signature, 1, 8, fp_out);

    /* write shaders */
    WRITE_SHADERS_TO_FILE(shader1a, pass_A_apply_settings)
    WRITE_SHADERS_TO_FILE(shader1a, pass_B_blur_filter)
    WRITE_SHADERS_TO_FILE(shader1a, pass_C_horizontal_resize)
    WRITE_SHADERS_TO_FILE(shader1a, pass_D1_phosphor_mask_720p)
    WRITE_SHADERS_TO_FILE(shader1a, pass_D2_phosphor_mask_1080p)
    WRITE_SHADERS_TO_FILE(shader1a, pass_E_vertical_resize)
    WRITE_SHADERS_TO_FILE(shader1a, pass_L_linear_upscale)
    WRITE_SHADERS_TO_FILE(shader1a, pass_OV1_standard)
    WRITE_SHADERS_TO_FILE(shader1a, pass_OV2_fade)
  }
  else if (G_source == SOURCE_SHADER_1B)
  {
    /* write signature */
    signature[0] = 'S';
    signature[1] = 'H';
    signature[2] = 'A';
    signature[3] = 'D';
    signature[4] = 'E';
    signature[5] = 'R';
    signature[6] = '1';
    signature[7] = 'B';

    fwrite(signature, 1, 8, fp_out);

    /* write shaders */
    WRITE_SHADERS_TO_FILE(shader1b, pass_A_apply_brightness)
    WRITE_SHADERS_TO_FILE(shader1b, pass_B_nearest_upscale)
    WRITE_SHADERS_TO_FILE(shader1b, pass_C_linear_upscale)
    WRITE_SHADERS_TO_FILE(shader1b, pass_D_horizontal_cubic)
    WRITE_SHADERS_TO_FILE(shader1b, pass_E_vertical_scanlines)
    WRITE_SHADERS_TO_FILE(shader1b, pass_OV1_standard)
    WRITE_SHADERS_TO_FILE(shader1b, pass_OV2_fade)
  }
  else if (G_source == SOURCE_SHADER_2A)
  {
    /* write signature */
    signature[0] = 'S';
    signature[1] = 'H';
    signature[2] = 'A';
    signature[3] = 'D';
    signature[4] = 'E';
    signature[5] = 'R';
    signature[6] = '2';
    signature[7] = 'A';

    fwrite(signature, 1, 8, fp_out);

    /* write shaders */
    WRITE_SHADERS_TO_FILE(shader2a, pass_OV_A_tiles)
    WRITE_SHADERS_TO_FILE(shader2a, pass_OV_B_sky_parallax)
    WRITE_SHADERS_TO_FILE(shader2a, pass_OV_C_sprites)
    WRITE_SHADERS_TO_FILE(shader2a, pass_OV_D_fade)
    WRITE_SHADERS_TO_FILE(shader2a, pass_OV_E_convert_to_rgb)
    WRITE_SHADERS_TO_FILE(shader2a, pass_UP_A_apply_brightness)
    WRITE_SHADERS_TO_FILE(shader2a, pass_UP_B_nearest_upscale)
    WRITE_SHADERS_TO_FILE(shader2a, pass_UP_C_linear_upscale)
    WRITE_SHADERS_TO_FILE(shader2a, pass_UP_D_horizontal_cubic)
    WRITE_SHADERS_TO_FILE(shader2a, pass_UP_E_vertical_scanlines)
  }
  else if (G_source == SOURCE_SHADER_2Z)
  {
    /* write signature */
    signature[0] = 'S';
    signature[1] = 'H';
    signature[2] = 'A';
    signature[3] = 'D';
    signature[4] = 'E';
    signature[5] = 'R';
    signature[6] = '2';
    signature[7] = 'Z';

    fwrite(signature, 1, 8, fp_out);

    /* write shaders */
    WRITE_SHADERS_TO_FILE(shader2z, pass_A_tiles)
    WRITE_SHADERS_TO_FILE(shader2z, pass_B_sprites)
    WRITE_SHADERS_TO_FILE(shader2z, pass_C_convert_to_rgb)
    WRITE_SHADERS_TO_FILE(shader2z, pass_D_linear_upscale)
  }

  /* close output file */
  fclose(fp_out);

  /* cleanup */
  if (source_buffer != NULL)
  {
    free(source_buffer);
    source_buffer = NULL;
  }

  return 0;
}
