const {model} = require('objection');
const knex = require('knex')(require('../../knexfile').development);
model.knex(knex);

class User extends Model {
    static get tableName(){
        return 'users';
    }
    static get jsonSchema(){
        return {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
                id: {type: 'integer'},
                name: {type: 'string', minLength: 1},
                email: {type: 'string', format: 'email'},
                password: {type: 'string', minLength: 8}
            }
        };
    }
    async $beforeInsert(context){
        await super.$beforeInsert(context);
        this.password = await bcrypt.hash(this.password, 10);
    }
}
module.exports = User;