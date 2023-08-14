const {time, loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


// Values for a normal notification to be used by test
const matrix_decimals = [
    [ 3.45788928, -3.12857843, -0.26355039, 1],
    [ 3.44245193, -0.27898774, -2.66421811, 1],
    [-0.01543735,  2.84959069, -2.40066771, 1]
]
const matrix_decimals_result = [
    313271756843623347,
    314925909145660364,
    371802334010716287
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


    describe("Deploy Okay", function () {
        it("Should deploy without error", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);            
        });
    });

    describe("Solve Matrices", function () {
        it("Should solve matrix with integer value inputs", async function () {
            const {app, owner} = await loadFixture(fixtureDeployContract);

            const DECIMALS = 14

            const multiplier = Math.pow(10,DECIMALS);

            k1 = matrix_decimals.length;
            k2 = matrix_decimals[0].length;

            const b = [0, 0, 0]

            var matrix = []
            for (let y = 0; y < k1; y++) {
                var temp = [];
                for (let x = 0; x < k2; x++) {
                    temp.push(Math.round((matrix_decimals[y][x])*multiplier));
                }
                matrix.push(temp);
            }

            result = await app._invert_matrix(matrix);
            var result_out = [];
            for (let i=0; i<result.length; i++) {
                result_out[i] = parseInt(result[i]);
            }
            //console.log(result_out);
            expect(result_out == matrix_decimals_result, "Result is wrong");
        });

        // Large integer value inputs
        // Decimal value inputs when multiplied up
        // Different matrix dimensions

    });

    // ###########################################################################
    // describe("Testing parameters okay?", function () {
    //     it("Should have testing parameters fit in max_region and num_disaster_type parameters", async function () {
    //         const { app, owner } = await loadFixture(fixtureDeployVotingContract);
    //         threshold = parseInt(await app.THRESHOLD());
    //         timeout = parseInt(await app.TIMEOUT());
    //         max_region = parseInt(await app.MAX_REGION());
    //         num_disaster_types = parseInt(await app.NUM_DISASTER_TYPES());
    //         expect(threshold).to.be.above(0, "THRESHOLD value in contract must be more than 0");
    //         expect(timeout).to.be.above(0, "TIMEOUT value in contract must be more than 0");
    //         for (let i=0; i < notification_reg.in_regions.length; i++) {
    //             expect(max_region).to.be.above(notification_reg.in_regions[i], "Values for region in test are more than that in MAX_REGION in contract");
    //         }
    //         expect(num_disaster_types).to.be.above(-1);
    //     });
    // });

    
    // // ###########################################################################
    // describe("Deploy Contract", function () {
    //     it("Should set deployer to authorised user", async function () {
    //         const { app, owner } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.get_authorised(owner.address)).to.equal(true);
    //     });
    //     it("Should set deployer to num_notifications to 1", async function () {
    //         const { app, owner } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.num_notifications(owner.address)).to.equal(1);
    //     });
    //     it("Should set deployer to num_correct_notifications to 1", async function () {
    //         const { app, owner } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.num_correct_notifications(owner.address)).to.equal(1);
    //     });
    // });


    // // ###########################################################################
    // describe("Authorise New Users", function () {
    //     it("Should be deployed with only owner being authorised by default", async function () {
    //         const { app, owner, acc_b, acc_c } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.get_authorised(owner.address)).to.equal(true);
    //         expect(await app.get_authorised(acc_b.address)).to.equal(false);
    //         expect(await app.get_authorised(acc_c.address)).to.equal(false);
    //     });
    //     it("Should allow authorised users to authorise non-authorised user", async function () {
    //         const { app, owner, acc_b, acc_c } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.get_authorised(owner.address)).to.equal(true);
    //         expect(await app.get_authorised(acc_b.address)).to.equal(false);
    //         await app.connect(owner)._authorise_user(acc_b.address);
    //         expect(await app.get_authorised(owner.address)).to.equal(true);
    //         expect(await app.get_authorised(acc_b.address)).to.equal(true);
    //     });
    //     it("Should not allow non-authorised user to authorise a non-authorised user", async function () {
    //         const { app, owner, acc_b, acc_c } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.get_authorised(acc_b.address)).to.equal(false);
    //         expect(await app.get_authorised(acc_c.address)).to.equal(false);
    //         await expect(app.connect(acc_b)._authorise_user(acc_c.address, {gasLimit: 1000000})).to.be.revertedWith("Only authorised users can authorise new users");
    //         expect(await app.get_authorised(acc_b.address)).to.equal(false);
    //         expect(await app.get_authorised(acc_c.address)).to.equal(false);
    //     });
    //     it("Should not allow re-authoirsation of a user", async function () {
    //         const { app, owner, acc_b, acc_c } = await loadFixture(fixtureDeployVotingContract);
    //         expect(await app.get_authorised(acc_b.address)).to.equal(false);
    //         await expect(app.connect(owner)._authorise_user(acc_b.address, {gasLimit: 1000000})).to.not.be.reverted;
    //         expect(await app.get_authorised(acc_b.address)).to.equal(true);
    //         await expect(app.connect(owner)._authorise_user(acc_b.address, {gasLimit: 1000000})).to.be.revertedWith("New user is already authorised");
    //         expect(await app.get_authorised(acc_b.address)).to.equal(true);
    //     });

    // });
    
});
