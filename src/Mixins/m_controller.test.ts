import { M_Controller } from "./m_controller";

test("get_Set_Controller", () => {

    const sample_namespace = "sample/namespace";

    const sample_class = class extends M_Controller {

        constructor() {
            super();
            this.set_Controller();
        }

        public get_GlobalNamespace(): string {
            return sample_namespace;
        }

        public has_LocalNamespace(): boolean {
            return false;
        }

        public get_ControllerNamespace(): string {
            return this.get_Controller().get_GlobalNamespace();
        }

    };

    const response = (new sample_class()).get_ControllerNamespace();

    expect(response).toStrictEqual(sample_namespace);

});
