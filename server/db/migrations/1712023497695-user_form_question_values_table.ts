import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFormQuestionValuesTable1712023497695 implements MigrationInterface {
    name = 'UserFormQuestionValuesTable1712023497695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."form_status_enum" AS ENUM('Open', 'Closed')`);
        await queryRunner.query(`CREATE TABLE "form" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."form_status_enum" NOT NULL, "createdById" integer, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum" AS ENUM('Single', 'Multiple', 'Date', 'YesNo')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "name" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."question_type_enum" NOT NULL, "formId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "value" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "questionId" integer, CONSTRAINT "PK_0af87b1623a34dd5357bfdb38a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_e09b89bec04563ca2090620c9b8" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_e689d342171443bd0faf5df2134" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "value" ADD CONSTRAINT "FK_ec72dc8789ed682b7da10105c01" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "value" DROP CONSTRAINT "FK_ec72dc8789ed682b7da10105c01"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_e689d342171443bd0faf5df2134"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_e09b89bec04563ca2090620c9b8"`);
        await queryRunner.query(`DROP TABLE "value"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TYPE "public"."form_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
