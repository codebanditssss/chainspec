// Represents a function parameter
export interface FunctionParameter {
    name: string;
    type: string;
}

// Represents a function specification
export interface FunctionSpec {
    name: string;
    description: string;
    parameters: FunctionParameter[];
    preconditions: string[];
    postconditions: string[];
    security: string;
    events: string[];
    returns: string;
}

// Represents a state variable
export interface StateVariable {
    name: string;
    type: string;
    description: string;
}

// Represents an event  
export interface EventSpec {
    name: string;
    parameters: string;
    description: string;
}

//Complete contract specification
export interface ContractSpec {
    contractName: string;
    securityRequirements: string[];
    functions: FunctionSpec[];
    stateVariables: StateVariable[];
    events: EventSpec[];
    stateInvariants: string[];
}