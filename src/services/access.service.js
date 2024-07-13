"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      //Co dau hieu nghi van
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something is wrong! Please login again");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new UnauthorizedError("Shop not registered");

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new UnauthorizedError("Shop not registered");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //Da duoc su dung de lay token moi roi
      },
    });

    return {
      user,
      tokens,
    };
  };
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    //Check token da duoc su dung hay chua
    if (foundToken) {
      // decoded xem
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      //Xoa
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something is wrong! Please login again");
    }

    //No
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new UnauthorizedError("Shop not registered");

    //verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("2---", { userId, email });

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new UnauthorizedError("Shop not registered");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //Da duoc su dung de lay token moi roi
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delkey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delkey);
    return delkey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    //Check email exists
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not registered");
    }

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new UnauthorizedError("Error: Wrong password");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    // step 1: check email  exists
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already exists");
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHashed,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      //create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxx",
          message: "publicKeyString Error",
          status: "error",
        };
      }

      // Create Token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        message: "Created Shop Success",
        status: "success",
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: "xxx",
      message: "Create Shop Error",
      metadata: null,
    };
  };
}

module.exports = AccessService;
