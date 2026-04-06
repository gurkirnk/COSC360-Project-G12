import { removeUserById } from "../authAndUserRepository";
export async function adminRemoveUserById(id) {

    const results = await removeUserById(id);

    return {
        results: results,
    };
}