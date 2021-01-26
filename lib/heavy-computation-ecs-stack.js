const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecsPatterns = require("@aws-cdk/aws-ecs-patterns");
const environment = require("./env.vars.json");

class HeavyComputationEcsStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, "heavy-computation", {});
    cluster.addDefaultCloudMapNamespace({ name: "local" });

    const backendService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "backend",
      {
        cluster,
        taskImageOptions: {
          containerPort: 8000,
          image: ecs.ContainerImage.fromRegistry("kayis/hc-backend:latest"),
          environment: {
            ...environment,
            THUNDRA_AGENT_APPLICATION_NAME: "Backend",
            CALCULATOR_HOSTNAME: "calculator.local",
            ERROR_HOSTNAME: "error.local",
          },
        },
      }
    );

    const errorService = this.createService(
      cluster,
      "Error",
      "kayis/hc-error:latest",
      environment
    );
    errorService.connections.allowFrom(
      backendService.service,
      ec2.Port.tcp(8000)
    );

    const calculatorService = this.createService(
      cluster,
      "Calculator",
      "kayis/hc-calculator:latest",
      { ...environment, EMAIL_HOSTNAME: "email.local" }
    );
    calculatorService.connections.allowFrom(
      backendService.service,
      ec2.Port.tcp(8000)
    );

    const emailService = this.createService(
      cluster,
      "Email",
      "kayis/hc-email:latest",
      environment
    );
    emailService.connections.allowFrom(calculatorService, ec2.Port.tcp(8000));
  }

  createService(cluster, name, image, environment) {
    const taskDefinition = new ecs.FargateTaskDefinition(this, name + "Task");
    const containerDefinition = taskDefinition.addContainer(name, {
      image: ecs.ContainerImage.fromRegistry(image),
      environment: {
        ...environment,
        THUNDRA_AGENT_APPLICATION_NAME: name,
      },
    });
    containerDefinition.addPortMappings({ containerPort: 8000 });
    return new ecs.FargateService(this, name + "Service", {
      cluster,
      taskDefinition,
      cloudMapOptions: { name: name.toLowerCase() },
    });
  }
}

module.exports = { HeavyComputationEcsStack };
