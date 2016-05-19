/* global peg */

"use strict";

describe("compiler pass |removeProxyRules|", function() {
  var pass = peg.compiler.passes.transform.removeProxyRules;

  describe("when a proxy rule isn't listed in |allowedStartRules|", function() {
    it("updates references and removes it", function() {
      expect(pass).toChangeAST(
        [
          'start = proxy',
          'proxy = proxied',
          'proxied = "a"'
        ].join("\n"),
        {
          rules: [
            {
              name:       "start",
              expression: { type: "rule_ref", name: "proxied" }
            },
            { name: "proxied" }
          ]
        },
        { allowedStartRules: ["start"] }
      );
    });
  });

  describe("when a proxy rule is listed in |allowedStartRules|", function() {
    it("updates references but doesn't remove it", function() {
      expect(pass).toChangeAST(
        [
          'start = proxy',
          'proxy = proxied',
          'proxied = "a"'
        ].join("\n"),
        {
          rules: [
            {
              name:       "start",
              expression: { type: "rule_ref", name: "proxied" }
            },
            {
              name:       "proxy",
              expression: { type: "rule_ref", name: "proxied" }
            },
            { name: "proxied" }
          ]
        },
        { allowedStartRules: ["start", "proxy"] }
      );
    });
  });
});
