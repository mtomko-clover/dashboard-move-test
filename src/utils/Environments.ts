export interface Environment {
  shortTerm: string;
  environment: string;
  sessionIdString: string;
}

export class Environments {
  static environments: Environment[] = [
    {
      shortTerm: 'us',
      environment: 'www.clover.com',
      sessionIdString: 'stg1SessionId',
    },
    {
      shortTerm: 'dev1',
      environment: 'dev1.dev.clover.com',
      sessionIdString: 'dev1SessionId',
    },
    {
      shortTerm: 'stg1',
      environment: 'stg1.dev.clover.com',
      sessionIdString: 'stg1SessionId',
    },
    {
      shortTerm: 'eu',
      environment: 'www.eu.clover.com',
      sessionIdString: 'euSessionId',
    },
  ];

  public static getEnvironments(): Environment[] {
    return this.environments;
  }

  public static getDefaultEnvironment(): Environment {
    return this.getEnvironments()[1];
  }

  public static getFromShortTerm(shortTerm: string): Environment {
    const environments = this.getEnvironments();
    let environment = environments[0];

    environments.forEach(env => {
      if (env.shortTerm === shortTerm) {
        environment = env;
      }
    });
    return environment;
  }
}
