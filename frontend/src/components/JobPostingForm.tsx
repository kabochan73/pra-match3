"use client";

import { useState, type SubmitEvent } from "react";
import { ApiError } from "@/lib/api";
import { useSkills } from "@/lib/skills";
import {
  EMPLOYMENT_TYPE_LABELS,
  POSITION_LEVEL_LABELS,
  WORK_STYLE_LABELS,
  type EmploymentType,
  type JobPosting,
  type PositionLevel,
  type WorkStyle,
} from "@/lib/job-postings";
import type { JobPostingInput, JobPostingStatus } from "@/lib/company-job-postings";
import { FormField } from "./FormField";

const STATUS_OPTIONS: { value: JobPostingStatus; label: string }[] = [
  { value: "draft", label: "下書き" },
  { value: "published", label: "公開する" },
  { value: "closed", label: "募集終了" },
];

interface JobPostingFormProps {
  initialJobPosting?: JobPosting;
  submitLabel: string;
  onSubmit: (input: JobPostingInput) => Promise<void>;
}

export function JobPostingForm({
  initialJobPosting,
  submitLabel,
  onSubmit,
}: JobPostingFormProps) {
  const { data: skills } = useSkills();

  const [title, setTitle] = useState(initialJobPosting?.title ?? "");
  const [description, setDescription] = useState(initialJobPosting?.description ?? "");
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialJobPosting?.employment_type ?? "full_time",
  );
  const [workStyle, setWorkStyle] = useState<WorkStyle>(
    initialJobPosting?.work_style ?? "onsite",
  );
  const [positionLevel, setPositionLevel] = useState<PositionLevel | "">(
    initialJobPosting?.position_level ?? "",
  );
  const [minExperienceYears, setMinExperienceYears] = useState(
    initialJobPosting?.min_experience_years?.toString() ?? "",
  );
  const [prefecture, setPrefecture] = useState(initialJobPosting?.prefecture ?? "");
  const [salaryMin, setSalaryMin] = useState(initialJobPosting?.salary_min?.toString() ?? "");
  const [salaryMax, setSalaryMax] = useState(initialJobPosting?.salary_max?.toString() ?? "");
  const [status, setStatus] = useState<JobPostingStatus>(
    (initialJobPosting?.status as JobPostingStatus | undefined) ?? "draft",
  );
  const [skillIds, setSkillIds] = useState<number[]>(
    initialJobPosting?.skills?.map((skill) => skill.id) ?? [],
  );

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleSkill(skillId: number) {
    setSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSaved(false);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        employment_type: employmentType,
        work_style: workStyle,
        position_level: positionLevel || null,
        min_experience_years: minExperienceYears ? Number(minExperienceYears) : null,
        prefecture: prefecture || null,
        salary_min: salaryMin ? Number(salaryMin) : null,
        salary_max: salaryMax ? Number(salaryMax) : null,
        status,
        skill_ids: skillIds,
      });
      setIsSaved(true);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError("保存に失敗しました。時間をおいて再度お試しください。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <FormField
        label="求人タイトル"
        name="title"
        value={title}
        onChange={setTitle}
        errors={errors.title}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          仕事内容
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={6}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
        />
        {errors.description?.map((error) => (
          <p key={error} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="employment_type"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            雇用形態
          </label>
          <select
            id="employment_type"
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value as EmploymentType)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          >
            {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.employment_type?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="work_style"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            勤務形態
          </label>
          <select
            id="work_style"
            value={workStyle}
            onChange={(event) => setWorkStyle(event.target.value as WorkStyle)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          >
            {Object.entries(WORK_STYLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.work_style?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="position_level"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            経験レベル
          </label>
          <select
            id="position_level"
            value={positionLevel}
            onChange={(event) => setPositionLevel(event.target.value as PositionLevel | "")}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          >
            <option value="">指定なし</option>
            {Object.entries(POSITION_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.position_level?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <FormField
          label="必要経験年数"
          name="min_experience_years"
          type="number"
          value={minExperienceYears}
          onChange={setMinExperienceYears}
          errors={errors.min_experience_years}
          required={false}
        />

        <FormField
          label="勤務地(都道府県)"
          name="prefecture"
          value={prefecture}
          onChange={setPrefecture}
          errors={errors.prefecture}
          required={false}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            公開ステータス
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as JobPostingStatus)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <FormField
          label="給与下限(円)"
          name="salary_min"
          type="number"
          value={salaryMin}
          onChange={setSalaryMin}
          errors={errors.salary_min}
          required={false}
        />

        <FormField
          label="給与上限(円)"
          name="salary_max"
          type="number"
          value={salaryMax}
          onChange={setSalaryMax}
          errors={errors.salary_max}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">必要スキル</span>
        <div className="flex flex-wrap gap-3">
          {skills?.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
            >
              <input
                type="checkbox"
                checked={skillIds.includes(skill.id)}
                onChange={() => toggleSkill(skill.id)}
              />
              {skill.name}
            </label>
          ))}
        </div>
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}
      {isSaved && <p className="text-sm text-green-600">保存しました。</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isSubmitting ? "保存中..." : submitLabel}
      </button>
    </form>
  );
}
