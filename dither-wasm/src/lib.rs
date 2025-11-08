use wasm_bindgen::prelude::*;

fn generate_bayer_matrix(n: usize) -> Vec<u8> {
    if n == 1 {
        return vec![0];
    }

    let matrix = generate_bayer_matrix(n / 2);

    let top_left: Vec<u8> = matrix.iter().map(|&x| x * 4).collect();
    let top_right: Vec<u8> = matrix.iter().map(|&x| x * 4 + 2).collect();
    let bottom_left: Vec<u8> = matrix.iter().map(|&x| x * 4 + 3).collect();
    let bottom_right: Vec<u8> = matrix.iter().map(|&x| x * 4 + 1).collect();

    let new_size = matrix.len() * 4;
    let mut new_matrix = vec![0u8; new_size];

    for i in 0..new_size {
        let x = i % n;
        let y = i / n;

        let half = n / 2;

        let quadrant_index = (y % half) * half + (x % half);

        new_matrix[i] = if x < half && y < half {
            top_left[quadrant_index]
        } else if x >= half && y < half {
            top_right[quadrant_index]
        } else if x < half && y >= half {
            bottom_left[quadrant_index]
        } else {
            bottom_right[quadrant_index]
        };
    }
    new_matrix
}

#[wasm_bindgen]
pub fn apply_dithering(pixels: &[u8], width: usize, matrix_size: usize) -> Vec<u8> {
    let mut new_pixels = vec![0u8; pixels.len()];
    let matrix = generate_bayer_matrix(matrix_size);
    let matrix_max_value = matrix.iter().max().unwrap();
    let normalization_constant = 255 / matrix_max_value;

    for (i, pixel) in pixels.iter().enumerate() {
        let matrix_x = i % width % matrix_size;
        let matrix_y = i / width % matrix_size;
        let matrix_i = matrix_y * matrix_size + matrix_x;

        let threshold = matrix[matrix_i] * normalization_constant;
        new_pixels[i] = if *pixel > threshold { 255 } else { 0 };
    }

    new_pixels
}
