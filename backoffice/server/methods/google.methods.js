// importa o pacote e grava na variável Sparkpost
import { HTTP } from 'meteor/http';
import { Promise } from 'meteor/promise';

if (Meteor.isServer) {
    Meteor.methods({
        googleSearch: function(search, callback){
            check(search, String);

            return new Promise((resolve, reject) => {
                Meteor.http.call(
                    'GET',
                    'https://www.google.com/basepages/producttype/taxonomy-with-ids.pt-BR.txt',
                    {},
                    function(err, res){
                        var jvalue = {};
                        if(res.statusCode == 200){
                            // splita o resultado em um array
                            jvalue = res.content.split('\n');

                            // remove primeira e última posições (zoadas)
                            jvalue.splice(0, 1);
                            jvalue.splice(jvalue.length-1, 1);

                            jvalue = jvalue.map(function(value){
                                value = value.replace(/[0-9]/g, '');
                                value = value.replace(' - ', '');
                                return value;
                            });

                            resolve(jvalue);
                        }
                    }
                );
            });
        }
    });
}
