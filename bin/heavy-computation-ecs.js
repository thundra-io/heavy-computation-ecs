#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const {
  HeavyComputationEcsStack,
} = require("../lib/heavy-computation-ecs-stack");

const app = new cdk.App();
new HeavyComputationEcsStack(app, "HeavyComputationEcsStack");
