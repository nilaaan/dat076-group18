import { registerUser } from "./service/auth"; 

const testRegister = async () => {
    const result = await registerUser("testUser", "securePassword");
    console.log(result);
};

testRegister();
