import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { getServerPublicUrl } from "../config/env";
import type { IAssignment } from "../models/Assignment";
import type { IResult } from "../models/Result";

const PDF_DIR = path.join(process.cwd(), "pdfs");

function ensurePdfDir(): void {
  if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
  }
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function generateAssessmentPdf(
  result: IResult,
  assignment: IAssignment
): Promise<string> {
  ensurePdfDir();

  const filename = `assessment-${assignment._id.toString()}.pdf`;
  const filepath = path.join(PDF_DIR, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    doc.fontSize(18).font("Helvetica-Bold").text("Delhi Public School, Sector-4, Bokaro", {
      align: "center",
    });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica").text("AI Generated Assessment", { align: "center" });
    doc.moveDown(1);

    const totalMarks = assignment.questionTypes.reduce(
      (sum, q) => sum + q.count * q.marks,
      0
    );
    doc.fontSize(10).text(`Due Date: ${assignment.dueDate.toLocaleDateString("en-GB")}`);
    doc.text(`Maximum Marks: ${totalMarks}`, { align: "right" });
    doc.moveDown(0.5);
    doc.font("Helvetica-Oblique").text(
      "All questions are compulsory unless stated otherwise.",
      { align: "center" }
    );
    doc.font("Helvetica");
    doc.moveDown(1);

    doc.text("Name: ____________________________    Roll No: ____________    Section: ________");
    doc.moveDown(1.5);

    for (const section of result.sections) {
      doc.fontSize(13).font("Helvetica-Bold").text(section.title, { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica-Oblique").text(section.instruction, { align: "center" });
      doc.font("Helvetica");
      doc.moveDown(0.8);

      section.questions.forEach((question, index) => {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(`${index + 1}. [${question.difficulty}]`, { continued: true });
        doc.font("Helvetica").text(` ${question.text}  [${question.marks} Marks]`);

        if (question.options?.length) {
          question.options.forEach((option, optIndex) => {
            doc.fontSize(10).text(`   ${optionLabel(optIndex)}) ${option}`);
          });
        }

        doc.moveDown(0.6);
      });

      doc.moveDown(0.5);
    }

    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica-Bold").text("End of Question Paper", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(`${getServerPublicUrl()}/pdfs/${filename}`));
    stream.on("error", reject);
  });
}

export function deletePdfForAssignment(assignmentId: string): void {
  const filename = `assessment-${assignmentId}.pdf`;
  const filepath = path.join(PDF_DIR, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}
