const bcrypt =require('bcrypt');

class Hash{
    static async hash(str){
        const rounds =10;
        return await bcrypt.hash(str, rounds);
    }
    static async compare(password, hash){
        return await bcrypt.compare(password, hash);
    }
}

module.exports =Hash;