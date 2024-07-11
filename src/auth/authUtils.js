"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log("error in verify accessToken", err);
      } else {
        console.log("verify accessToken", decoded);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  //Check userId exists
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError("Invalid Request");
  }

  // Get access token
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Key not found");
  }

  //Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }

  //Check user
  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (decodedUser.userId !== userId) {
      throw new UnauthorizedError("Invalid User");
    }

    req.keyStore = keyStore;

    // OK- return next()
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWT };
