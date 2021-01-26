const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const HeavyComputationEcs = require('../lib/heavy-computation-ecs-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new HeavyComputationEcs.HeavyComputationEcsStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
