import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, X, AlertCircle, Loader2 } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";
import { createPostSchema } from "../validations/post.validation";
import { cx } from "../utils/helpers";

/**
 * @param {object} props
 * @param {{body?: string, image?: string|null}} [props.initial]
 * @param {(values: {body: string, image?: File|null, removeImage?: boolean}) => Promise<void>} props.onSubmit
 * @param {string} [props.submitLabel]
 */
export default function PostForm({ initial, onSubmit, submitLabel = "Publish" }) {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const isEdit = !!initial;
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: { body: initial?.body || "", image: initial?.image || null },
  });

  function pickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageRemoved(false);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setValue("image", url, { shouldValidate: true });
  }

  function removeImage() {
    setImageFile(null);
    setPreview(null);
    setImageRemoved(true);
    setValue("image", null, { shouldValidate: true });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(values) {
    setSubmitting(true);
    try {
      await onSubmit({
        body: values.body.trim(),
        image: imageFile || undefined,
        removeImage: isEdit && imageRemoved ? true : undefined,
      });
    } catch {
  
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card composer-modal composer-page">
      <div className="composer-user">
        <Avatar user={user} size={40} />
        <div>
          <div className="composer-user-name">{user?.name}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)}>
        <textarea
          className={cx("textarea", errors.body && "input-error")}
          placeholder="What's on your mind?"
          rows={5}
          autoFocus
          {...register("body")}
        />

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Selected upload preview" />
            <button type="button" className="image-remove" onClick={removeImage} aria-label="Remove image">
              <X size={15} />
            </button>
          </div>
        )}

        {errors.body && (
          <div className="form-error">
            <AlertCircle size={14} /> {errors.body.message}
          </div>
        )}

        <div className="composer-modal-tools">
          <button type="button" className="tool-chip" onClick={() => fileRef.current?.click()}>
            <ImageIcon size={17} /> Photo
          </button>
          <input ref={fileRef} type="file" name="postImage" id="postImage" accept="image/*" hidden onChange={pickImage} />
        </div>

        <div className="modal-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="maiven-spin" /> : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
