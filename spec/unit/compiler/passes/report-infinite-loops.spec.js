/* global peg */

"use strict";

describe("compiler pass |reportInfiniteLoops|", function() {
  var pass = peg.compiler.passes.check.reportInfiniteLoops;

  it("reports infinite loops for zero_or_more", function() {
    expect(pass).toReportError('start = ("")*', {
      message:  "Possible infinite loop detected.",
      location: {
        start: { offset:  8, line: 1, column:  9 },
        end:   { offset: 13, line: 1, column: 14 }
      }
    });
  });

  it("reports infinite loops for one_or_more", function() {
    expect(pass).toReportError('start = ("")+', {
      message:  "Possible infinite loop detected.",
      location: {
        start: { offset:  8, line: 1, column:  9 },
        end:   { offset: 13, line: 1, column: 14 }
      }
    });
  });

  it("computes expressions that always consume input on success correctly", function() {
    expect(pass).toReportError([
      'start = a*',
      'a "a" = ""'
    ].join('\n'));
    expect(pass).not.toReportError([
      'start = a*',
      'a "a" = "a"'
    ].join('\n'));

    expect(pass).toReportError('start = ("" / "a" / "b")*');
    expect(pass).toReportError('start = ("a" / "" / "b")*');
    expect(pass).toReportError('start = ("a" / "b" / "")*');
    expect(pass).not.toReportError('start = ("a" / "b" / "c")*');

    expect(pass).toReportError('start = ("" { })*');
    expect(pass).not.toReportError('start = ("a" { })*');

    expect(pass).toReportError('start = ("" "" "")*');
    expect(pass).not.toReportError('start = ("a" "" "")*');
    expect(pass).not.toReportError('start = ("" "a" "")*');
    expect(pass).not.toReportError('start = ("" "" "a")*');

    expect(pass).toReportError('start = (a:"")*');
    expect(pass).not.toReportError('start = (a:"a")*');

    expect(pass).toReportError('start = ($"")*');
    expect(pass).not.toReportError('start = ($"a")*');

    expect(pass).toReportError('start = (&"")*');
    expect(pass).toReportError('start = (&"a")*');

    expect(pass).toReportError('start = (!"")*');
    expect(pass).toReportError('start = (!"a")*');

    expect(pass).toReportError('start = (""?)*');
    expect(pass).toReportError('start = ("a"?)*');

    expect(pass).toReportError('start = (""*)*');
    expect(pass).toReportError('start = ("a"*)*');

    expect(pass).toReportError('start = (""+)*');
    expect(pass).not.toReportError('start = ("a"+)*');

    expect(pass).toReportError('start = ("")*');
    expect(pass).not.toReportError('start = ("a")*');

    expect(pass).toReportError('start = (&{ })*');

    expect(pass).toReportError('start = (!{ })*');

    expect(pass).toReportError([
      'start = a*',
      'a = ""'
    ].join('\n'));
    expect(pass).not.toReportError([
      'start = a*',
      'a = "a"'
    ].join('\n'));

    expect(pass).toReportError('start = ""*');
    expect(pass).not.toReportError('start = "a"*');

    expect(pass).not.toReportError('start = [a-d]*');

    expect(pass).not.toReportError('start = .*');
  });
});
