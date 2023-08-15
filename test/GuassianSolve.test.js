const {time, loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const matrix_2d = [
    [4, 5, 12],
    [7, -3, 4]
]

const matrix_3d = [
    [3, -1, 14, 7],
    [2, 2, 3, 0],
    [1, -12, -18, 33]
]

const matrix_4d = [
    [3, -1, 14, 7, 9],
    [2, 2, 3, 0, 14],
    [1, -12, -18, 33, 23],
    [18, 32, -8, 9, 42]
]

const matrix_5d = [
    [3, -1, 14, 7, 9, 44],
    [2, 2, 3, 0, 14, 32],
    [1, -12, -18, 33, 23, 84],
    [18, 32, -8, 9, 42, 49],
    [18, 32, -8, 9, 42, 1024]
]



// Values for a normal notification to be used by test
const matrix_decimals = [
    [ 3.45788928, -3.12857843, -0.26355039, 1],
    [ 3.44245193, -0.27898774, -2.66421811, 1],
    [-0.01543735,  2.84959069, -2.40066771, 1]
]



describe("GuassianSolves Contract", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function fixtureDeployContract() {
  
        // Contracts are deployed using the first signer/account by default
        const [owner, acc_b, acc_c, acc_d] = await ethers.getSigners();

        // console.log("Account Address'");
        // console.log("Owner: ", owner.address);
        // console.log("Acc_b: ", acc_b.address);
        // console.log("Acc_c: ", acc_c.address);
    
        const Contract = await ethers.getContractFactory("GuassianSolve");
        const app = await Contract.deploy();
  
      return { app, owner, acc_b, acc_c, acc_d };
    }

    async function checkOutput(matrix, values) {
        var wrong = false;
        var sum;
        for (let x = 0; x < values.length; x++) {
            values[x] = values[x]/Math.pow(10,18);
        }
        for (let y = 0; y < matrix.length; y++) {
            sum = 0;
            for (let x = 0; x < matrix[0].length-1; x++) {
                sum += matrix[y][x] * values[x]
            }
            if (Math.round(sum, 10) != matrix[y][matrix[0].length-1]) {
                wrong = true;
                break;
            }
        }
        if (!wrong) {
            return true;
        }
        else {
            return false;
        }
    }


    describe("Deploy Okay", function () {
        it("Should deploy without error", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);            
        });
    });

    describe("Solve Matrices", function () {
        it("Should solve matrix with integer value inputs", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);

            const DECIMALS = 15

            const multiplier = Math.pow(10,DECIMALS);

            k1 = matrix_decimals.length;
            k2 = matrix_decimals[0].length;

            var matrix = []
            for (let y = 0; y < k1; y++) {
                var temp = [];
                for (let x = 0; x < k2; x++) {
                    temp.push(Math.round((matrix_decimals[y][x])*multiplier));
                }
                matrix.push(temp);
            }
            result = await app.solve_matrix(matrix);
            var result_out = [];
            for (let i=0; i<result.length; i++) {
                result_out[i] = parseInt(result[i]);
            }
            //console.log(result_out);
            expect(await checkOutput(matrix_decimals, result_out)).to.equal(true);
        });


        it("Should solve matrix that are 2x2", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);

            result = await app.solve_matrix(matrix_2d);
            var result_out = [];
            for (let i=0; i<result.length; i++) {
                result_out[i] = parseInt(result[i]);
            }
            //console.log(result_out);
            expect(await checkOutput(matrix_2d, result_out)).to.equal(true);
        });


        it("Should solve matrix that are 3x3", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);

            result = await app.solve_matrix(matrix_3d);
            var result_out = [];
            for (let i=0; i<result.length; i++) {
                result_out[i] = parseInt(result[i]);
            }
            //console.log(result_out);
            expect(await checkOutput(matrix_3d, result_out)).to.equal(true);
        });

        it("Should solve matrix that are 4x4", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);

            result = await app.solve_matrix(matrix_4d);
            var result_out = [];
            for (let i=0; i<result.length; i++) {
                result_out[i] = parseInt(result[i]);
            }
            //console.log(result_out);
            expect(await checkOutput(matrix_4d, result_out)).to.equal(true);
        });

        // DOESNT WORK AS OVERFLOW THROUGH MULTIPLICATIONS
        it("Should solve matrix that are 5x5", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);

            result = await app.solve_matrix(matrix_5d);
            var result_out = [];
            for (let i=0; i<result.length; i++) {
                result_out[i] = parseInt(result[i]);
            }
            console.log(result_out);
            expect(await checkOutput(matrix_5d, result_out)).to.equal(true);
        });

        // Large integer value inputs
        // Decimal value inputs when multiplied up
        // Different matrix dimensions

    });

});
