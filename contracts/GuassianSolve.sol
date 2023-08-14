// SPDX-License-Identifier: BSD-4-Clause
pragma solidity >=0.8.20;

//import "./hardhat/console.sol";

import "./FloatingPointMaths.sol";

/// @title Guassian Elimination Solver
/// @author 0x365
/// @notice Solves the matrix problem ax=b where a and b are known matrices using guassian elimination
/// @dev WIP - currently only square matrices
contract GuassianSolve is FloatingPointMaths {
    

    /// @notice Inverts a given matrix `a` using Gaussian elimination.
    /// @param a The coefficient matrix to be inverted.
    /// @return An array containing the solution vector.
    function _invert_matrix(int256[][] memory a) 
        public 
        pure 
        returns (int256[] memory) 
    {  
        // a should be input as follows with any required dimensions
        //  | a, a, a, b |
        //  | a, a, a, b |
        //  | a, a, a, b |
        //  | a, a, a, b |
        int256[][] memory a_triangle = _upper_triangular(a);
        int256[] memory x = _back_substitution(a_triangle);
        return x;        
    }


    /// @notice Converts a given matrix `a` into upper triangular form using Gaussian elimination.
    /// @param a The matrix to be transformed.
    /// @return The matrix in upper triangular form.
    function _upper_triangular(int256[][] memory a)
        public 
        pure 
        returns (int256[][] memory) 
    {
        // Gets dimensions of array
        uint k = a.length;
        uint k2 = a[0].length;
        // Gets matrix in Echelon Form
        // z - determines the diagnol
        // y - determines the row that the operation is being done on
        // x - determines the column in the row of the operation
        for (uint z = 0; z < k-1; z++) {
            int256[][] memory a2 = new int256[][](k);
            int mul_1 = a[z][z];
            require(mul_1 != 0, "Input matrix is singular");
            // Loop through rows
            for (uint y = 0; y < k; y++) {
                int256[] memory a2_temp = new int256[](k2);
                if (y <= z) {a2_temp = a[y];}
                else {
                    // Loop through columns
                    int mul_2 = a[y][z];
                    require(mul_2 != 0, "Input matrix is singular");
                    for (uint x = 0; x < k2; x++) {
                        // Guassian Elimination
                        a2_temp[x] = a[y][x]*mul_1 - a[z][x]*mul_2;
                    }
                }
                a2[y] = a2_temp;  
            }
            a = a2;
        }
        return a;
    }


    /// @notice Solves a system of equations using backward substitution after Gaussian elimination.
    /// @param a The upper triangular matrix representing the system of equations.
    /// @return An array containing the solution vector.
    function _back_substitution(int256[][] memory a)
        public
        pure
        returns (int256[] memory)
    {
        uint k = a.length;
        uint k2 = a[0].length;
        
        int256[] memory out = new int256[](k);
        for (uint y = k-1; y >= 0; y--) {
            int256 d = a[y][k2-1];
            for (uint x = k-1; x > y; x-- ) {
                d = d - a[y][x]*out[x];
            }
            out[y] = divide(d, a[y][y]);
            if (y == 0) {
                break;
            }
        }
        int256 sum = 0;
        for (uint y = 0; y < k; y++) {
            sum += out[y];
        }
        //int256[] memory out2 = new int256[](k);
        for (uint y = 0; y < k; y++) {
            out[y] = divide_big(out[y], sum);
            //console.logInt(out2[y]);
        }
        return out;
    }

}
