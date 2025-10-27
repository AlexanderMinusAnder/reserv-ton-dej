"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.role = exports.status = void 0;
const typeorm_1 = require("typeorm");
const Reservation_1 = require("./Reservation");
const Specificity_1 = require("./Specificity");
var status;
(function (status) {
    status["demi-pensionnaire"] = "demi-pensionnaire";
    status["interne"] = "interne";
})(status || (exports.status = status = {}));
var role;
(function (role) {
    role["eleve"] = "eleve";
    role["admin"] = "admin";
    role["cuisine"] = "cuisine";
})(role || (exports.role = role = {}));
let Users = class Users {
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: status,
        default: status["demi-pensionnaire"]
    }),
    __metadata("design:type", String)
], Users.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: role,
        default: role.eleve
    }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reservation_1.Reservation, (reservation) => reservation.user),
    __metadata("design:type", Array)
], Users.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Specificity_1.Specificity, (specificity) => specificity.user),
    __metadata("design:type", Array)
], Users.prototype, "specificity", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)()
], Users);
