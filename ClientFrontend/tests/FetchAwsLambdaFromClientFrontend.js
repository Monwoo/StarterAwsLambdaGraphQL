// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

// QUnit.test( "hello test", function( assert ) {
//   assert.ok( 1 == "1", "Passed!" );
// });

const apiBase = "https://t4n3k2xzbe.execute-api.us-east-1.amazonaws.com/prod/graphql";
const queryParam = "query=%7B%20users%20%7B%20firstname%20%7D%20%7D";
const fetchTestorHeaders = new Headers();
const fetchTestorInit = {
    method: 'GET',
    headers: fetchTestorHeaders,
    mode: 'no-cors', // 'cors',
    cache: 'default'
};

// https://qunitjs.com/cookbook/
var testor = window.QUnit;
testor.module( "Tests d'acceptation" );
// QUnit.module( "module name", {
//   beforeEach: function( assert ) {
//     assert.ok( true, "one extra assert per test" );
//   }, afterEach: function( assert ) {
//     assert.ok( true, "and one extra assert after each test" );
//   }
testor.test( "Fetching AWS deployed GraphQL API", function( assert ) {
    var done = assert.async(1);
    fetch(apiBase + "?" + queryParam) //, fetchTestorInit)
    .then((response) => response.json())
    .then((rep) => {
        // TODO build from mocked up data, associated with test data inside mongoDB
        const targetResult = {
            data: {
                users: [
                    {
                        firstname: "Tom"
                    }
                ]
            }
        };
        // TODO : assert from mongo db schema & data available & query request
        assert.ok(rep.data.users[0].firstname, "Did fail to fetch formated API data" );
        done();
        return rep;
    })
    .catch((error) => {
        console.error(error);
        assert.ok( false, "Did fail to fetch API" );
        done();
    });
});
