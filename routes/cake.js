var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET cake page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM cake",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("cake/list", {
          title: "Home",
          data: rows,
          session_store: req.session,
        });
      }
    );
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var cake = {
        id: req.params.id,
      };

      var delete_sql = "delete from cake where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          cake,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/cake");
            } else {
              req.flash("msg_info", "Delete Data Success");
              res.redirect("/cake");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM cake where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/cake");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Data siswa can't be find!");
              res.redirect("/cake");
            } else {
              console.log(rows);
              res.render("cake/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the nama").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_stok = req.sanitize("stok").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_ukuran = req.sanitize("ukuran").escape();

      var cake = {
        nama: v_nama,
        harga: v_harga,
        stok: v_stok,
        ukuran: v_ukuran,
      };

      var update_sql = "update cake SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          cake,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("cake/edit", {
                nama: req.param("nama"),
                harga: req.param("harga"),
                stok: req.param("stok"),
                ukuran: req.param("ukuran"),
              });
            } else {
              req.flash("msg_info", "Update data success");
              res.redirect("/cake/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/cake/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the nama").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_stok = req.sanitize("stok").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_ukuran = req.sanitize("ukuran").escape();

    var cake = {
      nama: v_nama,
      harga: v_harga,
      stok: v_stok,
      ukuran: v_ukuran,
    };

    var insert_sql = "INSERT INTO cake SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        cake,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("cake/add", {
              nama: req.param("nama"),
              harga: req.param("harga"),
              stok: req.param("stok"),
              ukuran: req.param("ukuran"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create data siswa success");
            res.redirect("/cake");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("cake/add", {
      nama: req.param("nama"),
      harga: req.param("harga"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("cake/add", {
    title: "Add New Data",
    nama: "",
    stok: "",
    ukuran: "",
    harga: "",
    session_store: req.session,
  });
});

module.exports = router;
