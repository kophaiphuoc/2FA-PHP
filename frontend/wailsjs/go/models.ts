export namespace app {
	
	export class OTPAndTimeExp {
	
	
	    static createFrom(source: any = {}) {
	        return new OTPAndTimeExp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

