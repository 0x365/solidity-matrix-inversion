// SPDX-License-Identifier: BSD-4-Clause
pragma solidity >=0.8.20;

import "../library/contracts/hardhat/console.sol";

import "../library/contracts/openzeppelin/utils/Strings.sol";


/// [  2   1  -1 ]   [   8 ]
/// [ -3  -1   2 ] = [ -11 ]
/// [ -2   1   2 ]   [  -3 ]
// https://en.wikipedia.org/wiki/Gaussian_elimination

contract MatrixInversion {

    int256 MAX_NUMBER = 10**18;
    
    function _invert_matrix(int256[][] memory a) 
        public 
        view 
        returns (int256[] memory) 
    {   
        // MULTIPLY NUMBERS BY 1e18 outside or inside function
        uint k = a.length;
        uint k2 = a[0].length;
        
        // Gets matrix in Echelon Form
        //Loop through diagnol start point (not sure)
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
                        a2_temp[x] = a[y][x]*mul_1 - a[z][x]*mul_2;
                    }
                }
                a2[y] = a2_temp;  
            }
            a = a2;
        }

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

    function divide (int256 a, int256 b) 
        public
        view
        returns(int256)
    {   
        int256 a_scaled = a * MAX_NUMBER;
        int256 out = (a_scaled-(a_scaled % b))/b;
        return out/MAX_NUMBER;
    }

    function divide_big (int256 a, int256 b) 
        public
        view
        returns(int256)
    {   
        int256 a_scaled = a * MAX_NUMBER;
        int256 out = (a_scaled-(a_scaled % b))/b;
        return out;
    }


}
