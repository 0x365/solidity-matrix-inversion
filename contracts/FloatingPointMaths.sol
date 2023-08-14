// SPDX-License-Identifier: BSD-4-Clause
pragma solidity >=0.8.20;

/// @title Float Point Maths
/// @author 0x365
/// @notice Some operations for doing maths that may end in decimals
/// @dev WIP
contract FloatingPointMaths {

    function divide (int256 a, int256 b) 
        public
        pure
        returns(int256)
    {   
        int256 a_scaled = a * 1e18;
        int256 out = (a_scaled-(a_scaled % b))/b;
        return out/1e18;
    }

    function divide_big (int256 a, int256 b) 
        public
        pure
        returns(int256)
    {   
        int256 a_scaled = a * 1e18;
        int256 out = (a_scaled-(a_scaled % b))/b;
        return out;
    }


}
